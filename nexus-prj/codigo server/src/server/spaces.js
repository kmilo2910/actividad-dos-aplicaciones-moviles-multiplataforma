import { getPostgresPool } from '@/server/postgres';
import { normalizeLanguage } from '@/i18n/config';

const translations = {
  'space-1': {
    en: {
      name: 'North Room',
      shortDescription: 'Quiet room for focused work.',
      longDescription: 'A bright and quiet room for individual sessions or small teams.',
      benefits: ['Quiet environment', 'Natural light', 'Ideal for small teams'],
    },
    fr: {
      name: 'Salle Nord',
      shortDescription: 'Salle calme pour travailler avec concentration.',
      longDescription: 'Une salle lumineuse et silencieuse pour les petites équipes.',
      benefits: ['Environnement calme', 'Lumière naturelle', 'Idéale pour les petites équipes'],
    },
    it: {
      name: 'Sala Nord',
      shortDescription: 'Sala tranquilla per lavorare concentrati.',
      longDescription: 'Una sala luminosa e silenziosa per sessioni individuali o piccoli gruppi.',
      benefits: ['Ambiente silenzioso', 'Luce naturale', 'Ideale per piccoli gruppi'],
    },
    de: {
      name: 'Nordraum',
      shortDescription: 'Ruhiger Raum für konzentriertes Arbeiten.',
      longDescription: 'Ein heller und ruhiger Raum für Einzeltermine oder kleine Teams.',
      benefits: ['Ruhige Umgebung', 'Natürliches Licht', 'Ideal für kleine Teams'],
    },
  },
  'space-2': {
    en: {
      name: 'South Room',
      shortDescription: 'Flexible space for meetings and teamwork.',
      longDescription:
        'A spacious room for meetings, collaborative study and interactive projects.',
      benefits: ['Large collaborative table', 'Meeting space', 'Comfortable furniture'],
    },
    fr: {
      name: 'Salle Sud',
      shortDescription: 'Espace flexible pour les réunions et le travail en équipe.',
      longDescription: 'Un espace vaste pour les réunions et les études collaboratives.',
      benefits: ['Grande table collaborative', 'Espace de réunion', 'Mobilier confortable'],
    },
    it: {
      name: 'Sala Sud',
      shortDescription: 'Spazio flessibile per riunioni e lavoro di squadra.',
      longDescription:
        'Uno spazio ampio per riunioni, studio collaborativo e progetti interattivi.',
      benefits: ['Ampio tavolo collaborativo', 'Spazio per riunioni', 'Arredi confortevoli'],
    },
    de: {
      name: 'Südraum',
      shortDescription: 'Flexibler Raum für Meetings und Teamarbeit.',
      longDescription: 'Ein großzügiger Raum für Meetings und gemeinsames Lernen.',
      benefits: ['Großer Gemeinschaftstisch', 'Besprechungsbereich', 'Bequeme Möbel'],
    },
  },
  'space-3': {
    en: {
      name: 'Collaborative Table',
      shortDescription: 'Open table for university projects.',
      longDescription: 'An open space for groups that need to share ideas and work dynamically.',
      benefits: ['More capacity', 'Open layout', 'Ideal for group projects'],
    },
    fr: {
      name: 'Table collaborative',
      shortDescription: 'Table ouverte pour les projets universitaires.',
      longDescription: 'Un espace ouvert pour les grands groupes et le travail dynamique.',
      benefits: ['Grande capacité', 'Configuration ouverte', 'Idéale pour les projets de groupe'],
    },
    it: {
      name: 'Tavolo collaborativo',
      shortDescription: 'Tavolo aperto per progetti universitari.',
      longDescription: 'Uno spazio aperto per gruppi numerosi che condividono idee e materiali.',
      benefits: ['Maggiore capacità', 'Configurazione aperta', 'Ideale per progetti di gruppo'],
    },
    de: {
      name: 'Gemeinschaftstisch',
      shortDescription: 'Offener Tisch für Hochschulprojekte.',
      longDescription:
        'Ein offener Bereich für Gruppen zum Teilen von Ideen und dynamischer Zusammenarbeit.',
      benefits: ['Mehr Kapazität', 'Offene Anordnung', 'Ideal für Gruppenprojekte'],
    },
  },
};

function localize(space, language) {
  const translation = translations[space.id]?.[normalizeLanguage(language)];
  return translation ? { ...space, ...translation } : space;
}

export async function listSpaces(language = 'es') {
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records WHERE collection = 'spaces' ORDER BY created_at ASC`
  );
  return result.rows.map(({ data }) => localize(data, language));
}

export async function getSpace(id, language = 'es') {
  const result = await getPostgresPool().query(
    `SELECT data FROM nexus_records WHERE collection = 'spaces' AND id = $1`,
    [id]
  );
  return result.rows[0] ? localize(result.rows[0].data, language) : null;
}
