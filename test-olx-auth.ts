import 'dotenv/config'
  import { chromium } from 'playwright'

  async function main() {
    const title = ""
    const description = ""

    const browser = await chromium.connectOverCDP('http://localhost:9222')
    const context = browser.contexts()[0]
    const page = await context.newPage()

    const step = async (label: string, fn: () => Promise<any>, delay = 1000) => {
      await fn()
      console.log(label)
      await page.waitForTimeout(delay)
    }

    await step('Зашли на OLX', () => page.goto('https://www.olx.ua/uk/myaccount/'), 1500)
    await step('Нажали создать объявление', () =>
  page.locator('[data-testid="post-new-ad-button"]').click())

    const popup = await page.locator('[data-button-variant="tertiary"]').count()
    if (popup > 0) {
      await step('Попап закрыт', () => page.locator('[data-button-variant="tertiary"]').click())
    }

    await step('Ввели название', () => page.locator('#title').fill('Комплект футболка + шорти'))
    await step('Перешли на страницу создания', () =>
  page.locator('[data-nx-name="NexusButton"]').click())
    await step('Загрузили фото', () =>
  page.locator('[data-testid="attach-photos-input"]').first().setInputFiles('./uploads/test.jpg'),
  1500)
    await step('Состояние - новое', () =>
  page.locator('[data-testid="parameters.state_new_unactive"]').click(), 1500)
    await step('Выбрали размер', () =>
  page.locator('[data-textinput-has-suffix="true"]').first().click(), 1500)
    await step('Нажали Інше', () => page.locator('[data-testid="dropdown-menu-item"]').last().click(),
  1500)
    await step('Ввели цену', () => page.locator('[id="parameters.price.price"]').fill('500'), 1500)
    await step('Ввели описание', () => page.locator('[id="description"]').fill('Описаниеописание...'), 1500)
    await step('Частное лицо', () =>
  page.locator('[data-testid="private_business_private_unactive"]').click(), 1500)
    await step('Опубликовали', () => page.locator('[data-testid="submit-btn"]').click(), 1500)
  }

  main()