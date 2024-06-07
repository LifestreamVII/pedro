import React, { useEffect, useState } from "react";

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      // Ne pas afficher le bouton immédiatement
      window.setTimeout(() => {
        setDeferredPrompt(e);
        setIsVisible(true);
        console.log("beforeinstallprompt event captured");
      }, 3000); // Attendre 5 secondes avant de montrer le bouton
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsVisible(false); // Cacher le bouton après l'installation
      console.log("PWA was installed");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", () => {
        setIsVisible(false); // Assurez-vous de retirer le gestionnaire d'événements lors du nettoyage
      });
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    (deferredPrompt as any).prompt();
    const choiceResult = await (deferredPrompt as any).userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    setDeferredPrompt(null);
    setIsVisible(false); // Cacher le bouton après le choix de l'utilisateur
  };

  return isVisible ? (
    <button className="btnInstall" onClick={handleInstallClick}>
      Install App
    </button>
  ) : null;
};

export default InstallButton;
