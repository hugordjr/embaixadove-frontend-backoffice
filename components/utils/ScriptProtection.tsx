"use client";

import { useEffect } from "react";

export function ScriptProtection() {
  useEffect(() => {
    const protectFromExternalScripts = () => {
      // Lista de scripts problemáticos conhecidos
      const problematicScripts = [
        'share-modal.js',
        'locatorjs',
        'hook.bundle.js',
        'share-modal'
      ];

      // Remover scripts problemáticos
      problematicScripts.forEach(scriptName => {
        const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
        scripts.forEach(script => {
          console.log(`Removendo script problemático: ${scriptName}`);
          script.remove();
        });
      });

      // PROTEGER CONTRA REQUISIÇÕES DO DEVTOOLS
      // Interceptar fetch para bloquear requisições problemáticas
      const originalFetch = window.fetch;
      window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        
        // Bloquear requisições do DevTools
        if (url.includes('.well-known/appspecific/com.chrome.devtools.json') ||
            url.includes('locatorjs') ||
            url.includes('share-modal')) {
          console.warn('Requisição do DevTools bloqueada:', url);
          return Promise.resolve(new Response('{}', { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
          }));
        }
        
        return originalFetch.call(this, input, init);
      };

      // Proteger addEventListener contra chamadas em elementos null/undefined
      const originalAddEventListener = Element.prototype.addEventListener;
      Element.prototype.addEventListener = function(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        if (this === null || this === undefined) {
          console.warn('Tentativa de adicionar event listener em elemento null/undefined:', type);
          return;
        }
        return originalAddEventListener.call(this, type, listener, options);
      };

      // Interceptar erros globais relacionados a DOM
      window.addEventListener('error', (event) => {
        if (event.message.includes('Cannot read properties of null') ||
            event.message.includes('Cannot read properties of undefined') ||
            event.message.includes('addEventListener')) {
          console.warn('Erro de DOM interceptado:', event.message);
          event.preventDefault();
          return false;
        }
      });

      console.log('Proteção contra scripts externos e DevTools ativada');
    };

    // Executar proteção
    protectFromExternalScripts();

    // Limpeza ao desmontar
    return () => {
      // Restaurar métodos originais se necessário
    };
  }, []);

  return null;
}
