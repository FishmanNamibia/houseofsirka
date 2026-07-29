import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

/**
 * Injected at build time from STOREFRONT_URL — see the `define` in
 * medusa-config.ts. Declared here because the admin bundle is type-checked
 * without knowing about Vite's globals.
 */
declare const __SIRKA_STOREFRONT_URL__: string

/**
 * A short standing header on the orders list — where whoever runs the shop
 * spends their day — with a way back to the storefront.
 *
 * The rest of the admin's branding no longer happens here. Colours, the
 * monogram, the login screen and the browser title are all handled at the
 * document level in admin-brand.ts, which reaches pages a widget cannot. This
 * is left as content rather than decoration: it says which shop, in which
 * currency, and how payment is confirmed.
 */
const BrandHeader = () => {
  return (
    <Container className="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <Text size="small" weight="plus" className="text-ui-fg-muted uppercase tracking-widest">
          Windhoek workroom
        </Text>
        <Heading level="h2" className="mt-1">
          Orders
        </Heading>
        <Text size="small" className="text-ui-fg-subtle mt-1">
          Prices in Namibian dollars · payment confirmed by hand against proof of transfer
        </Text>
      </div>

      <a
        href={__SIRKA_STOREFRONT_URL__}
        target="_blank"
        rel="noreferrer"
        className="bg-ui-button-inverted text-ui-contrast-fg-primary txt-compact-small-plus rounded-md px-4 py-2.5"
      >
        View the storefront
      </a>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default BrandHeader
