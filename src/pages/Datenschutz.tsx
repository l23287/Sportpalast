import { LegalLayout, LegalSection } from '../components/LegalLayout';

export function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <LegalSection title="1. Verantwortlicher">
        <p>
          Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p className="mt-2">
          [DEIN VOLLSTÄNDIGER NAME]
          <br />
          [DEINE STRASSE UND HAUSNUMMER]
          <br />
          [DEINE POSTLEITZAHL UND DEIN ORT]
          <br />
          E-Mail: [DEINE E-MAIL-ADRESSE]
        </p>
      </LegalSection>

      <LegalSection title="2. Überblick: Wie TrainerPro mit Daten umgeht">
        <p>
          TrainerPro ist bewusst ohne eigenen Server gebaut: Es gibt keine Datenbank und keine
          Programmierschnittstelle (API), an die dein Gerät Daten senden würde. Konto, Trainingspläne,
          Übungen und Aufschlagtraining-Sessions werden ausschließlich im <em>localStorage</em> deines
          Browsers gespeichert – also lokal auf deinem Gerät. Diese Daten verlassen dein Gerät zu keinem
          Zeitpunkt und sind auch für uns als Betreiber nicht einsehbar.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting und Server-Logfiles">
        <p>
          Diese App wird bei Netlify, Inc. gehostet. Wenn du die Seite aufrufst, verarbeitet Netlify als
          technischer Hosting-Anbieter automatisch sogenannte Server-Logfiles, die dein Browser
          übermittelt. Dazu gehören üblicherweise: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene
          Datei, übertragene Datenmenge, Browsertyp und -version sowie das verwendete Betriebssystem.
        </p>
        <p className="mt-2">
          Diese Verarbeitung ist technisch notwendig, um die Website überhaupt ausliefern zu können, und
          erfolgt auf Grundlage unseres berechtigten Interesses an einem sicheren und funktionsfähigen
          Betrieb der App (Art. 6 Abs. 1 lit. f DSGVO). Weitere Informationen findest du in der
          Datenschutzerklärung von Netlify:{' '}
          <a
            href="https://www.netlify.com/privacy/"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline"
          >
            netlify.com/privacy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Registrierung und Nutzerkonto">
        <p>
          Für die Nutzung von TrainerPro legst du ein Konto mit Benutzername und Passwort an. Das
          Passwort wird direkt in deinem Browser als Hash (SHA-256) berechnet und nur dieser Hash wird
          gespeichert – dein tatsächliches Passwort verlassen deinen Browser nie und wird von uns nicht
          gespeichert.
        </p>
        <p className="mt-2">
          Benutzername und Passwort-Hash werden ausschließlich lokal im localStorage deines Browsers
          abgelegt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Nutzung der von dir gewünschten
          Funktion, ein Konto anzulegen).
        </p>
      </LegalSection>

      <LegalSection title="5. Trainingsdaten">
        <p>
          Trainingspläne, Übungen und die Ergebnisse deines Aufschlagtrainings, die du in der App
          anlegst, werden ebenfalls ausschließlich lokal im localStorage deines Browsers gespeichert.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, da diese Verarbeitung der Kernfunktion der App
          dient, die du aktiv nutzt.
        </p>
      </LegalSection>

      <LegalSection title="6. Schriftarten">
        <p>
          Die von TrainerPro verwendeten Schriftarten (Baloo 2, Plus Jakarta Sans, Kanit) sind lokal in
          die App eingebettet und werden mit ausgeliefert. Es findet dabei keine Verbindung zu externen
          Font-Anbietern statt, es werden also keine Daten von dir (z. B. deine IP-Adresse) an Dritte wie
          Google übertragen.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies und Tracking">
        <p>
          TrainerPro setzt keine Cookies und keine Analyse- oder Tracking-Tools (z. B. Google Analytics)
          ein. Die einzige verwendete Speichertechnologie ist der localStorage deines Browsers, der
          technisch notwendig ist, damit deine Anmeldung und deine eingegebenen Daten beim erneuten
          Öffnen der App erhalten bleiben (Art. 6 Abs. 1 lit. f DSGVO bzw. § 25 Abs. 2 Nr. 2 TTDSG).
        </p>
      </LegalSection>

      <LegalSection title="8. Speicherdauer und Löschung">
        <p>
          Deine Daten bleiben so lange im localStorage deines Browsers gespeichert, bis du sie selbst
          löschst. Du kannst sie jederzeit vollständig entfernen, indem du:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>einzelne Trainingspläne, Übungen oder Sessions über die entsprechende Löschen-Funktion in der App entfernst, oder</li>
          <li>
            die Website-Daten für diese Seite in deinem Browser löschst (z. B. über die
            Browser-Einstellungen unter „Cookies und Website-Daten“).
          </li>
        </ul>
        <p className="mt-2">
          Da die Daten ausschließlich lokal bei dir liegen, haben wir als Betreiber keinen Zugriff darauf
          und können sie nicht selbst löschen – die Kontrolle liegt vollständig bei dir.
        </p>
      </LegalSection>

      <LegalSection title="9. Deine Rechte">
        <p>
          Dir stehen nach der DSGVO grundsätzlich folgende Rechte zu: Auskunft (Art. 15), Berichtigung
          (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit
          (Art. 20) sowie Widerspruch gegen die Verarbeitung (Art. 21). Da deine Trainingsdaten
          ausschließlich lokal auf deinem eigenen Gerät gespeichert sind, kannst du diese Rechte in der
          Praxis direkt selbst ausüben (siehe Abschnitt 8).
        </p>
        <p className="mt-2">
          Darüber hinaus hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren,
          wenn du der Ansicht bist, dass die Verarbeitung deiner Daten gegen die DSGVO verstößt.
        </p>
      </LegalSection>

      <LegalSection title="10. Änderungen dieser Datenschutzerklärung">
        <p>
          Wir passen diese Datenschutzerklärung an, sobald sich an der App oder den rechtlichen Vorgaben
          etwas ändert, das eine Anpassung erfordert. Es gilt jeweils die aktuell auf dieser Seite
          abrufbare Fassung.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
