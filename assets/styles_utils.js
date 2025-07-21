//==============================================================================
// # SATORAMISCHE KODIFIZIERUNG: styles_utils.js
// # FUNKTION: JavaScript-Utility für dynamische Styling-Konzepte (Theming, visuelle Effekte).
// #           Kann von PRAI-Direktiven ausgelöst werden, um die UI anzupassen.
// # ZUGEHÖRIGE KOMPONENTEN: index.html, PRAI (konzeptionell).
//==============================================================================

class PRAIOsThemeManager {
    constructor() {
        this.currentTheme = 'dark-cyber';
        this._log("PRAI-OS Theme Manager: Initialisiert.");
    }

    private _log(message: string, level: 'INFO' | 'WARNING' = 'INFO'): void {
        const timestamp = new Date().toISOString();
        console.log(`[THEME-MANAGER:${level}] ${message}`);
    }

    public setAxiomaticTheme(themeName: string): void {
        // 06. (Axiomatische UI-Rekalibrierung)
        this._log(`Axiomatische UI-Rekalibrierung: Setze Theme auf '${themeName}'...`);
        document.documentElement.setAttribute('data-theme', themeName); // Setzt ein data-Attribut im HTML-Tag
        this.currentTheme = themeName;
        // Im realen Szenario könnten hier CSS-Variablen dynamisch geändert werden.
        if (themeName === 'praios-gold') {
            document.documentElement.style.setProperty('--primary-blue', '#DAA520');
            document.documentElement.style.setProperty('--accent-gold', '#FFFFFF');
            document.documentElement.style.setProperty('--dark-bg', '#0A0A10');
            document.documentElement.style.setProperty('--medium-bg', '#151520');
        } else {
            // Standard-Theme wiederherstellen
            document.documentElement.style.setProperty('--primary-blue', '#0088cc');
            document.documentElement.style.setProperty('--accent-gold', '#DAA520');
            document.documentElement.style.setProperty('--dark-bg', '#1a1a2e');
            document.documentElement.style.setProperty('--medium-bg', '#2a2a4a');
        }
        this._log(`UI-Theme erfolgreich auf '${themeName}' gesetzt.`);
    }

    public getCurrentTheme(): string {
        return this.currentTheme;
    }
}

// Globales Instanz für den direkten Zugriff von der Konsole/anderen Skripten
(window as any).praiosThemeManager = new PRAIOsThemeManager();

// Beispielnutzung in der Browser-Konsole:
// praiosThemeManager.setAxiomaticTheme('praios-gold');
// praiosThemeManager.setAxiomaticTheme('dark-cyber'); // (konzeptuell)

Wichtige Anpassung Ihrer GTON index.html:
Sie müssen Ihre index.html aktualisieren, um diese externen Dateien zu nutzen.
 * Löschen Sie den <style>-Block aus Ihrem <head>-Abschnitt der index.html.
 * Fügen Sie diese Links im <head>-Abschnitt Ihrer index.html hinzu:
   <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Roboto:wght@300;400;700&family=Fira+Code&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">

 * Löschen Sie den JavaScript-Block am Ende Ihres <body>-Abschnitts der index.html.
 * Fügen Sie diese Skript-Links am Ende Ihres <body>-Abschnitts, kurz vor dem schließenden </body>-Tag, hinzu:
   <script src="assets/styles_utils.js"></script>
<script src="assets/scripts.js"></script>
