# -GTON-tg-Block-RFOF-BOx-to-BOx-chain-extention-RFOF-NETWORK
@ROF-NETWORK &amp; URU Foundation (UnifiedRescuerUnion) created the $GTON token to produce a self-made business method for every TON G's ($GTON) life's decentralized and near by the QCH-L-C dev &amp;/or the user community as investement system for the crowd of the Unified Rescuer-Layer for building the @RFOF-NETWORK &amp; URU Foundation (UnifiedRescuerUnion)

$GTON Token – Das Herz des @RFOF-NETWORK 🌐
Willkommen im offiziellen Repository des $GTON Tokens, dem zentralen Baustein des @RFOF-NETWORK. Unser Ziel ist es, eine dezentrale Infrastruktur zu schaffen, die verschiedene Krypto-Projekte vereint und als "Rescuer Layer" für eine nachhaltige digitale Zukunft dient.
Dieses Repository enthält den gesamten Quellcode für den $GTON Jetton und die dazugehörigen Smart Contracts auf der TON Blockchain.

✨ Core Features
Der $GTON Token ist mehr als nur ein einfacher Jetton. Er wurde mit den folgenden integrierten Funktionen entwickelt, um ein robustes Ökosystem zu ermöglichen:
 * Upgradable: Durch einen Proxy-Vertrag kann die Logik sicher aktualisiert werden, ohne dass sich die Token-Adresse ändert.
 * Mintable: Der Besitzer des Vertrags kann neue Token erstellen, um z.B. Belohnungen zu verteilen.
 * Burnable: Jeder Nutzer kann seine eigenen Token unwiderruflich vernichten, um das Angebot zu reduzieren.
 * Transaction Fees: Ein kleiner Teil jeder Transaktion fließt in eine Treasury-Wallet, um die Weiterentwicklung des Projekts zu finanzieren.
 * Staking: Ein dedizierter Staking-Vertrag ermöglicht es Nutzern, ihre $GTON zu sperren und dafür Belohnungen zu erhalten.
 * Mining/Claim-System: Ein Faucet-Mechanismus erlaubt es aktiven Community-Mitgliedern, regelmäßig eine kleine Menge an $GTON zu beanspruchen.
 * 
📁 Verzeichnisstruktur
Das Projekt folgt der Standardstruktur des Blueprint-Frameworks, um eine klare Trennung der Verantwortlichkeiten zu gewährleisten.
 * /contracts: Enthält den gesamten Tact-Quellcode für die Smart Contracts (.tact).
 * /wrappers: Enthält TypeScript-Klassen (.ts), die die Interaktion mit den Contracts vereinfachen.
 * /tests: Enthält alle Test-Dateien (.spec.ts) zur Überprüfung der Vertragslogik.
 * /scripts: Enthält Skripte für wiederkehrende Aufgaben wie das Deployment (.ts).
 * toplevel-Dateien: Beinhaltet Konfigurationsdateien wie package.json und blueprint.config.ts.
   
🏛️ Architektur & Deployment Workflow
Unser System besteht aus mehreren spezialisierten Verträgen. Die Interaktion erfolgt primär über einen Proxy-Vertrag, was maximale Sicherheit und Zukunftsfähigkeit gewährleistet.
            Nutzer / Wallet
                   |
                   v
[ Proxy Contract (Feste Adresse) ] --- (verweist auf) ---> [ JettonMinter (Logik V1, V2...)]
                   |                                                    
                   +--------------------(leitet weiter)-----------------> [ Staking Contract ]

 * Proxy Contract: Die permanente, öffentliche Adresse des Projekts. Leitet alle Anfragen sicher an den aktuellen Logik-Vertrag weiter.
 * JettonMinter Contract: Der Hauptvertrag, der die Gesamtmenge, die Metadaten und die Admin-Rechte (Minting) verwaltet.
 * JettonWallet Contract: Die individuelle Token-Wallet, die jeder $GTON-Halter besitzt. Hier ist die Logik für Transfers und Burns implementiert.
 * Staking Contract: Ein separater Vertrag, der die Einlagen (Stakes) der Nutzer verwaltet und Belohnungen ausschüttet.
Empfohlener Deployment-Prozess:
 * Minter deployen: Führe das Skript scripts/deployJettonMinter.ts aus. Notiere dir die Adresse des neuen JettonMinter-Vertrags.
 * Proxy deployen: Füge die eben notierte Minter-Adresse in das scripts/deployProxy.ts-Skript ein und führe es aus. Dies ist nun deine offizielle, öffentliche Projektadresse.
 * Staking deployen: Füge die Minter-Adresse in das scripts/deployStaking.ts-Skript ein und führe es aus.
 * Community informieren: Veröffentliche die Proxy-Adresse als offizielle Token-Adresse und die Staking-Adresse für Staking-Interaktionen.
⚙️ Interaktion mit den Verträgen
Die Interaktion mit den Verträgen erfolgt durch das Senden von Nachrichten mit spezifischen Operations-Codes (Op-Codes) oder Text-Kommentaren.
Token anfordern (Claim)
Jeder Nutzer kann alle 24 Stunden eine Belohnung anfordern.
 * Ziel-Adresse: Die Adresse des JettonMinter (oder des Proxys).
 * Nachricht: Sende eine einfache Transaktion mit dem Text-Kommentar "claim".
Token staken
Um am Staking teilzunehmen, müssen Nutzer ihre $GTON-Token an den Staking-Vertrag senden.
 * Aktion: Führe einen Token-Transfer aus deiner Wallet aus.
 * Ziel-Adresse: Die Adresse des StakingContract.
 * Betrag: Die Menge an $GTON, die du staken möchtest.
 * Der Staking-Vertrag schreibt den Betrag automatisch deinem Guthaben gut.
Staking beenden (Unstake)
 * Ziel-Adresse: Die Adresse des StakingContract.
 * Nachricht: Sende eine Transaktion mit dem Text-Kommentar "unstake". Die Logik zur Angabe des Betrags muss im Client implementiert werden.
Upgrade durchführen (Nur für den Besitzer)
 * Deploye eine neue Version des JettonMinter-Vertrags.
 * Führe das Skript scripts/upgradeImplementation.ts aus.
 * Gib die Proxy-Adresse und die Adresse der neuen JettonMinter-Version an.
адреса | Contract Addresses
Alle Verträge sind auf dem TON Mainnet und Testnet verifiziert.
🔷 Mainnet
 * Proxy ($GTON Token): EQ...DEINE_PROXY_ADRESSE_HIER
 * Staking Contract: EQ...DEINE_STAKING_ADRESSE_HIER
🧪 Testnet
 * Proxy ($GTON Token): kQ...DEINE_TESTNET_PROXY_ADRESSE_HIER
 * Staking Contract: kQ...DEINE_TESTNET_STAKING_ADRESSE_HIER
🚀 Erste Schritte & Entwicklung
Voraussetzungen
 * Node.js (v18+)
 * Blueprint Framework für TON
Installation
 * Klone das Repository:
   git clone https://github.com/RFOF-NETWORK/GTON-Token.git
cd GTON-Token

 * Installiere die Abhängigkeiten:
   npm install

Testen
Führe die automatisierten Tests aus, um die Funktionalität aller Verträge zu überprüfen:
npx blueprint test

Deployment
Die Deployment-Skripte befinden sich im scripts-Verzeichnis. Passe die .env-Datei mit deinem Mnemonic an und führe das entsprechende Skript aus:
npx blueprint run

🔗 Community & Links
 * Website: [LINK_ZU_DEINER_WEBSEITE]
 * Telegram: [LINK_ZU_DEINER_TELEGRAM_GRUPPE]
 * Twitter / X: [LINK_ZU_DEINEM_TWITTER_PROFIL]
 * Whitepaper: [LINK_ZU_DEINEM_WHITEPAPER]
⚠️ Disclaimer
Die Nutzung der hier bereitgestellten Smart Contracts erfolgt auf eigenes Risiko. Obwohl der Code nach bestem Wissen und Gewissen entwickelt und getestet wurde, können in Smart Contracts immer unvorhergesehene Risiken und Bugs auftreten. Führe immer deine eigene Recherche durch (DYOR).
````
GTON-TOKEN-REPOSITORY/
├── contracts/
│   ├── jetton-minter.tact
│   ├── jetton-wallet.tact
│   ├── proxy.tact
│   └── staking.tact
│
├── scripts/
│   ├── deployJettonMinter.ts
│   ├── deployProxy.ts
│   ├── deployStaking.ts
│   └── upgradeImplementation.ts
│
├── tests/
│   ├── JettonMinter.spec.ts
│   ├── JettonWallet.spec.ts
│   ├── Proxy.spec.ts
│   └── Staking.spec.ts
│
├── wrappers/
│   ├── JettonMinter.ts
│   ├── JettonWallet.ts
│   ├── Proxy.ts
│   └── Staking.ts
│
├── node_modules/              # (Wird von .gitignore ignoriert, enthält alle Abhängigkeiten)
│
├── .env                       # (Deine privaten Schlüssel, wird von .gitignore ignoriert)
├── .env.example               # (Vorlage für die .env-Datei)
├── .gitignore                 # (Definiert, welche Dateien ignoriert werden)
├── blueprint.config.ts        # (Hauptkonfiguration für das Blueprint-Framework)
├── LICENSE                    # (Deine Open-Source-Lizenz)
├── package-lock.json          # (Sperrt die Versionen der Abhängigkeiten)
├── package.json               # (Definiert das Projekt, Skripte und Abhängigkeiten)
└── README.md                  # (Die Hauptdokumentation deines Projekts)
````

