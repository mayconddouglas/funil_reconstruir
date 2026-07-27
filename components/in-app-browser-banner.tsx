"use client"

import { useEffect, useState } from "react"
import { ExternalLink, X } from "lucide-react"
import { clarityEvent } from "@/lib/funnel"

// ================================================================
//  DETECÇÃO DE NAVEGADOR IN-APP (WebView do Instagram/Facebook/etc)
//
//  Por quê: o WebView interno desses apps (WKWebView no iOS) é mais
//  lento, quebra autofill/pagamento salvo, e é a causa raiz documentada
//  de erros como "window.webkit.messageHandlers" que vimos no Clarity
//  (github.com/microsoft/clarity/issues/1066). Como quase todo o
//  tráfego pago vem de anúncio no Instagram, oferecer uma saída rápida
//  pro navegador de verdade tende a reduzir abandono nos primeiros
//  segundos.
// ================================================================
const IN_APP_PATTERNS: Record<string, RegExp> = {
  Instagram: /Instagram/i,
  Facebook: /FBAN|FBAV|FB_IAB/i,
  Messenger: /FB_IAB\/MESSENGER/i,
  TikTok: /musical_ly|TikTok/i,
  LinkedIn: /LinkedInApp/i,
  Line: /\bLine\//i,
}

function detectInAppBrowser(userAgent: string): string | null {
  for (const [name, pattern] of Object.entries(IN_APP_PATTERNS)) {
    if (pattern.test(userAgent)) return name
  }
  return null
}

function isIOS(userAgent: string) {
  return /iPhone|iPad|iPod/i.test(userAgent)
}

// Tenta abrir a MESMA url (preservando fbclid/utm etc, essenciais pro
// Pixel) no navegador padrão do sistema. Sempre com fallback universal,
// já que nenhum método sozinho funciona em 100% das versões de app.
function attemptEscape(url: string, ios: boolean) {
  if (ios) {
    // Esquema nativo do iOS que força a abertura no Safari.
    window.location.href = url.replace(/^https?:\/\//, "x-safari-https://")
  } else {
    // Intent explícito pedindo ao Android pra abrir fora do WebView atual.
    const bare = url.replace(/^https?:\/\//, "")
    const intentUrl = `intent://${bare}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${encodeURIComponent(url)};end`
    window.location.href = intentUrl
  }
  // Fallback universal: se o esquema acima for ignorado pelo app, tenta
  // abrir em nova aba (funciona em parte dos WebViews).
  setTimeout(() => {
    try {
      window.open(url, "_blank")
    } catch {
      // silencioso — se nada funcionar, o texto do banner já orienta o passo manual
    }
  }, 400)
}

export function InAppBrowserBanner() {
  const [appName, setAppName] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      const ua = navigator.userAgent
      const detected = detectInAppBrowser(ua)
      const alreadyDismissed = window.sessionStorage.getItem("iab-banner-dismissed") === "1"
      if (detected && !alreadyDismissed) {
        setAppName(detected)
        clarityEvent("in_app_browser_detectado")
      }
    } catch {
      // A detecção é um "nice to have" — nunca deve travar o carregamento do site.
    }
  }, [])

  if (!appName || dismissed) return null

  function handleEscape() {
    clarityEvent("in_app_browser_escape_click")
    try {
      attemptEscape(window.location.href, isIOS(navigator.userAgent))
    } catch {
      // se a tentativa falhar, o próprio texto do banner já orienta o passo manual (⋯ > Abrir no navegador)
    }
  }

  function handleDismiss() {
    setDismissed(true)
    try {
      window.sessionStorage.setItem("iab-banner-dismissed", "1")
    } catch {
      // sessionStorage pode estar bloqueado (modo privado) — sem problema, só não persiste
    }
  }

  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-primary/30 bg-background/95 px-4 py-3 text-foreground backdrop-blur">
      <p className="flex-1 text-pretty text-xs leading-snug text-muted-foreground sm:text-sm">
        Você está no navegador do {appName}. Toque em{" "}
        <strong className="text-foreground">Abrir</strong> para uma experiência mais
        rápida no seu navegador padrão.
      </p>
      <button
        onClick={handleEscape}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ExternalLink className="size-3.5" />
        Abrir
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Fechar aviso"
        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
