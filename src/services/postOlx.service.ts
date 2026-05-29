import 'dotenv/config'
import fs from 'fs'
import { chromium } from 'playwright'

export async function postOlx(title: string, description: string, price: string, images: Express.Multer.File[]) {

    try {
        const browser = await chromium.connectOverCDP('http://localhost:9222')
        const context = browser.contexts()[0]
        const page = await context.newPage()
        // page.on('response', async res => {
        //     if (res.url().includes('olx') && res.request().method() === 'POST') {
        //         console.log('POST:', res.url(), res.status())
        //         try {
        //             const body = await res.json()
        //             console.log('Ответ:', JSON.stringify(body, null, 2))
        //         } catch { }
        //     }
        // })

        const step = async (label: string, fn: () => Promise<any>, delay = 1000) => {
            await fn()
            console.log(label)
            await page.waitForTimeout(delay)
        }

        await step('Зашли на OLX', () => page.goto('https://www.olx.ua/uk/myaccount/'), 5000)
        await step('Нажали создать объявление', () =>
            page.locator('[data-testid="post-new-ad-button"]').click())

        const popup = await page.locator('[data-button-variant="tertiary"]').count()
        if (popup > 0) {
            await step('Попап закрыт', () => page.locator('[data-button-variant="tertiary"]').click())
        }

        await step('Ввели название', () => page.locator('#title').fill(title))
        await step('Перешли на страницу создания', () =>
            page.locator('[data-nx-name="NexusButton"]').click())
        const paths = images.map(f => f.path)
        await step('Загрузили фото', () =>
            page.locator('[data-testid="attach-photos-input"]').first().setInputFiles(paths),
            1500)
        await step('Состояние - новое', () =>
            page.locator('[data-testid="parameters.state_new_unactive"]').click(), 5000)
        await step('Выбрали размер', () =>
            page.locator('[data-textinput-has-suffix="true"]').first().click(), 5000)
        const size = await page.locator('[data-testid="dropdown-menu-item"]').first().count()
        if (size > 0) {
            await step('Нажали Інше', () => page.locator('[data-testid="dropdown-menu-item"]').last().click(),
                1500)
        }
        await step('Ввели цену', () => page.locator('[id="parameters.price.price"]').fill(price), 5000)
        await step('Ввели описание', () => page.locator('[id="description"]').fill(description), 5000)
        await step('Частное лицо', () =>
            page.locator('[data-testid="private_business_private_unactive"]').click(), 5000)
        await step('Выбрали вес 0.5кг', () =>
            page.locator('[aria-label="0-0.5 кг"]').click(), 5000)
        await step('Опубликовали', () => page.locator('[data-testid="submit-btn"]').click(), 1500)

        console.log('Успешно опубликовано!')
        for (const image of images) {
            fs.unlinkSync(image.path)
        }
        console.log('Uploads очишен')
    } catch (error) {
        console.error(error);
    }
}
