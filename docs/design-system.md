# Sistema de diseño de EstilosIA

Fuente de verdad: `src/app/globals.css` (tokens) y `tailwind.config.ts` (mapeo a clases).
Base de componentes: shadcn/ui (`src/components/ui`). Íconos: `lucide-react`. Tipografía: Geist + Geist Mono (`next/font`).

## Arquitectura en tres capas

```
Primitivos   --coral-600, --stone-50, --duration-fast     valores crudos, iguales en claro y oscuro
    ↓
Semánticos   --primary, --muted, --input, --ring           propósito; `.dark` los reasigna
    ↓
Componentes  --nav-height                                  valores propios de un componente
    ↓
Tailwind     bg-primary, hover:bg-primary-hover, h-nav     lo único que usan los componentes
```

Reglas:

1. **Los componentes nunca usan primitivos ni valores crudos.** Nada de `#hex`, `bg-orange-500` ni `hsl(16 100% 63%)` en TSX. Siempre clases semánticas (`bg-primary`, `text-muted-foreground`) o `hsl(var(--token))` cuando una librería pide un color (Recharts).
2. **Los nombres semánticos son los de shadcn.** No se renombran: así `npx shadcn@latest add ...` sigue funcionando sin tocar nada.
3. **Los colores son tripletes HSL** (`13 78% 46%`), no `hsl()`, para que funcionen los modificadores de opacidad (`bg-primary/20`).
4. **Un solo acento cromático: coral.** El resto es la escala `stone` (neutros cálidos, tono 24). Los colores de gráficos son la única excepción, y solo para datos.
5. **El hover de colores con texto usa un token sólido, no opacidad.** `hover:bg-primary/90` bajaba a 4,09:1 con texto blanco; `hover:bg-primary-hover` da 5,83:1.

## Capa 1: primitivos

| Familia | Tokens | Uso |
|---|---|---|
| Stone (tono 24) | `0` `50` `100` `200` `400` `500` `600` `700` `800` `850` `900` `925` `950` `1000` | Fondos, texto, bordes, sombra |
| Coral (marca, `#FF7043` = `coral-400`) | `50` `300` `400` `500` `600` `700` `800` `950` | Primario, acento, foco, hover |
| Red | `300` `400` `600` `700` | Destructivo |
| Datos | `teal-400/600` `slate-400/600` `amber-300/400` `rose-400/500` | Solo `--chart-*` |
| Forma y movimiento | `--radius-base` (12px), `--size-16` (64px), `--duration-fast` (150ms), `--duration-normal` (200ms), `--ease-out-expo` | Radio, alturas, transiciones |

## Capa 2: semánticos

| Token | Claro | Oscuro | Clase Tailwind |
|---|---|---|---|
| `--background` | stone-50 | stone-950 | `bg-background` |
| `--foreground` | stone-925 | stone-100 | `text-foreground` |
| `--card` / `--popover` | stone-0 | stone-925 | `bg-card`, `bg-popover` |
| `--primary` | coral-600 | coral-400 | `bg-primary`, `text-primary` |
| `--primary-foreground` | stone-0 | stone-950 | `text-primary-foreground` |
| `--primary-hover` | coral-700 | coral-300 | `hover:bg-primary-hover` |
| `--secondary` | stone-100 | stone-850 | `bg-secondary` |
| `--secondary-foreground` | stone-800 | stone-200 | `text-secondary-foreground` |
| `--muted` | stone-100 | stone-900 | `bg-muted` |
| `--muted-foreground` | stone-600 | stone-400 | `text-muted-foreground` |
| `--accent` | coral-50 | coral-950 | `bg-accent` (hover y navegación activa) |
| `--accent-foreground` | coral-800 | coral-300 | `text-accent-foreground` |
| `--destructive` | red-600 | red-400 | `bg-destructive` |
| `--destructive-foreground` | stone-0 | stone-950 | `text-destructive-foreground` |
| `--destructive-hover` | red-700 | red-300 | `hover:bg-destructive-hover` |
| `--border` | stone-200 | stone-800 | `border-border` (por defecto en `*`) |
| `--input` | stone-500 | stone-600 | `border-input` (límite de campos) |
| `--ring` | = `--primary` | = `--primary` | `ring-ring` |
| `--shadow` | stone-800 | stone-1000 | tiñe `shadow-sm` a `shadow-2xl` |
| `--chart-1..5` | coral-500, teal-600, slate-600, amber-400, rose-500 | coral-400, teal-400, slate-400, amber-300, rose-400 | `hsl(var(--chart-n))` |
| `--radius` | 12px | 12px | `rounded-lg` (12), `rounded-md` (10), `rounded-sm` (8) |

`--sidebar-*` apunta a los semánticos equivalentes; la app no usa la barra lateral de shadcn.

## Capa 3: componentes

| Token | Valor | Uso |
|---|---|---|
| `--nav-height` | `--size-16` (64px) | `h-nav` en `Navbar.tsx` |

Solo se crea un token de componente cuando un valor tiene que coincidir en más de un lugar o poder ajustarse sin tocar el componente. Los demás componentes usan directamente la capa semántica a través de sus clases.

## Modo oscuro

`src/app/layout.tsx` inyecta un script en `<head>` que pone o quita `.dark` en `<html>` según `prefers-color-scheme`, antes del primer pintado y en vivo si el sistema cambia. Tailwind usa `darkMode: ["class"]`, así que `dark:` también responde. Para agregar un selector manual de tema bastaría con cambiar ese script; los tokens no cambian.

## Especificación de estados: Button

| Variante | Default | Hover | Active | Focus visible | Disabled |
|---|---|---|---|---|---|
| `default` | `bg-primary` + `text-primary-foreground` | `bg-primary-hover` | `scale-[0.98]` | anillo 2px `ring` + offset 2px | opacidad 50%, sin eventos |
| `destructive` | `bg-destructive` + `text-destructive-foreground` | `bg-destructive-hover` | `scale-[0.98]` | ídem | ídem |
| `outline` | borde `input`, `bg-background` | `bg-accent` + `text-accent-foreground` | `scale-[0.98]` | ídem | ídem |
| `secondary` | `bg-secondary` | `bg-secondary/80` (sin texto blanco, no afecta contraste) | `scale-[0.98]` | ídem | ídem |
| `ghost` | transparente | `bg-accent` + `text-accent-foreground` | `scale-[0.98]` | ídem | ídem |
| `link` | `text-primary` | subrayado | ninguno | ídem | ídem |

Transición: `duration-fast` (150ms) + `ease-out-expo` sobre color, fondo, borde, sombra y transform. Con `prefers-reduced-motion: reduce`, `globals.css` anula duraciones y animaciones.

## Contraste verificado (WCAG 2.1)

| Par | Claro | Oscuro | Requisito |
|---|---|---|---|
| foreground / background | 16,74 | 16,79 | 4,5 |
| muted-foreground / card | 5,74 | 6,54 | 4,5 |
| muted-foreground / muted | 5,14 | 5,82 | 4,5 |
| secondary-foreground / secondary | 12,17 | 11,36 | 4,5 |
| primary-foreground / primary | 4,68 | 7,02 | 4,5 |
| primary-foreground / primary-hover | 5,83 | 8,81 | 4,5 |
| destructive-foreground / destructive | 5,81 | 5,21 | 4,5 |
| destructive-foreground / destructive-hover | 7,41 | 7,12 | 4,5 |
| accent-foreground / accent | 7,27 | 7,01 | 4,5 |
| input (borde) / card | 3,35 | 3,05 | 3 (no textual) |

Si se cambia un primitivo de color, hay que volver a calcular los pares que lo usan.

## Cómo agregar o cambiar un token

1. ¿Existe ya un semántico con ese propósito? Usalo.
2. Si hace falta un color nuevo, agregá el primitivo en la capa 1 y asignalo en **las dos** secciones semánticas (`:root` y `.dark`).
3. Exponelo en `tailwind.config.ts` como `hsl(var(--token))`.
4. Verificá contraste en claro y oscuro y actualizá la tabla de arriba.

## Validación

```bash
node <skill design-system>/scripts/validate-tokens.cjs --dir src/
```

Falsos positivos conocidos, que se aceptan:

- **Píxeles en `sizes` de `next/image`** (`ClothingCard`, `LookCard`, `OutfitSuggestion`, `WishlistItemCard`, `src/app/archivo/page.tsx`): son media queries del atributo HTML y tienen que ser px.
- **`#ccc` y `#fff` en `src/components/ui/chart.tsx`**: son selectores de atributos que Recharts pone por defecto (`[stroke='#ccc']`), usados justamente para reemplazarlos por tokens.

Colores que se mantienen literales a propósito: las muestras de `ColorSwatch.tsx` (representan el color real de una prenda) y los rellenos de `PRENDA_COLOR_MAP_FULL` en `src/app/actions.ts` (mismo motivo).

## Pendientes

- **Logo** (`src/components/icons/Logo.tsx`): degradado de `--primary` a `--accent`; el final casi no se lee sobre el fondo. Requiere decisión de marca.
