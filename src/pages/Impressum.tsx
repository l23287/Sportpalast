import { LegalLayout, LegalSection } from '../components/LegalLayout';

export function Impressum() {
  return (
    <LegalLayout title="Impressum">
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          Lorelei Isabell Hermann
          <br />
          Rantzaustraße 52
          <br />
          22926 Ahrensburg
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>E-Mail: hermannlorelei@gmail.com</p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt">
        <p>Lorelei Isabell Hermann, Anschrift wie oben.</p>
      </LegalSection>

      <LegalSection title="EU-Streitschlichtung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte">
        <p>
          Als Diensteanbieter sind wir für eigene Inhalte auf dieser App nach den allgemeinen Gesetzen
          verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
