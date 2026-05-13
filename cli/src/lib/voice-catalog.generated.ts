// AUTO-GENERATED from voice-manifests/. Do not edit by hand.
// Run `bun run gen-voices` to regenerate.

export interface Voice {
  voiceId: string;
  name?: string;
  gender?: string;
  tone?: string;
  useCase?: string;
  ageRange?: string;
  language?: string;
  /** Relative path under VOICE_TOOLS_DIR holding pre-generated <voiceId>.wav (if any). */
  sampleDir?: string;
  /** HTTP URL of a pre-uploaded sample (set on a minority of providers, e.g. KugelAudio). */
  sampleUrl?: string;
}

export const VOICE_CATALOG: Record<string, Voice[]> = {
  "deepgram/aura:2": [
    {
      "voiceId": "aura-2-amalthea-en",
      "name": "Amalthea",
      "gender": "feminine",
      "tone": "Engaging, Natural, Cheerful",
      "useCase": "Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-andromeda-en",
      "name": "Andromeda",
      "gender": "feminine",
      "tone": "Casual, Expressive, Comfortable",
      "useCase": "Customer Service, IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-apollo-en",
      "name": "Apollo",
      "gender": "masculine",
      "tone": "Confident, Comfortable, Casual",
      "useCase": "Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-arcas-en",
      "name": "Arcas",
      "gender": "masculine",
      "tone": "Natural, Smooth, Clear, Comfortable",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-aries-en",
      "name": "Aries",
      "gender": "masculine",
      "tone": "Warm, Energetic, Caring",
      "useCase": "Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-asteria-en",
      "name": "Asteria",
      "gender": "feminine",
      "tone": "Clear, Confident, Knowledgeable, Energetic",
      "useCase": "Advertising",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-athena-en",
      "name": "Athena",
      "gender": "feminine",
      "tone": "Calm, Smooth, Professional",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-atlas-en",
      "name": "Atlas",
      "gender": "masculine",
      "tone": "Enthusiastic, Confident, Approachable, Friendly",
      "useCase": "Advertising",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-aurora-en",
      "name": "Aurora",
      "gender": "feminine",
      "tone": "Cheerful, Expressive, Energetic",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-callista-en",
      "name": "Callista",
      "gender": "feminine",
      "tone": "Clear, Energetic, Professional, Smooth",
      "useCase": "IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-cordelia-en",
      "name": "Cordelia",
      "gender": "feminine",
      "tone": "Approachable, Warm, Polite",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-cora-en",
      "name": "Cora",
      "gender": "feminine",
      "tone": "Smooth, Melodic, Caring",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-delia-en",
      "name": "Delia",
      "gender": "feminine",
      "tone": "Casual, Friendly, Cheerful, Breathy",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-draco-en",
      "name": "Draco",
      "gender": "masculine",
      "tone": "Warm, Approachable, Trustworthy, Baritone",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-electra-en",
      "name": "Electra",
      "gender": "feminine",
      "tone": "Professional, Engaging, Knowledgeable",
      "useCase": "IVR, Advertising, Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-harmonia-en",
      "name": "Harmonia",
      "gender": "feminine",
      "tone": "Empathetic, Clear, Calm, Confident",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-helena-en",
      "name": "Helena",
      "gender": "feminine",
      "tone": "Caring, Natural, Positive, Friendly, Raspy",
      "useCase": "IVR, Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-hera-en",
      "name": "Hera",
      "gender": "feminine",
      "tone": "Smooth, Warm, Professional",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-hermes-en",
      "name": "Hermes",
      "gender": "masculine",
      "tone": "Expressive, Engaging, Professional",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-hyperion-en",
      "name": "Hyperion",
      "gender": "masculine",
      "tone": "Caring, Warm, Empathetic",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-iris-en",
      "name": "Iris",
      "gender": "feminine",
      "tone": "Cheerful, Positive, Approachable",
      "useCase": "IVR, Advertising, Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-janus-en",
      "name": "Janus",
      "gender": "feminine",
      "tone": "Southern, Smooth, Trustworthy",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-juno-en",
      "name": "Juno",
      "gender": "feminine",
      "tone": "Natural, Engaging, Melodic, Breathy",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-jupiter-en",
      "name": "Jupiter",
      "gender": "masculine",
      "tone": "Expressive, Knowledgeable, Baritone",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-luna-en",
      "name": "Luna",
      "gender": "feminine",
      "tone": "Friendly, Natural, Engaging",
      "useCase": "IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-mars-en",
      "name": "Mars",
      "gender": "masculine",
      "tone": "Smooth, Patient, Trustworthy, Baritone",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-minerva-en",
      "name": "Minerva",
      "gender": "feminine",
      "tone": "Positive, Friendly, Natural",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-neptune-en",
      "name": "Neptune",
      "gender": "masculine",
      "tone": "Professional, Patient, Polite",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-odysseus-en",
      "name": "Odysseus",
      "gender": "masculine",
      "tone": "Calm, Smooth, Comfortable, Professional",
      "useCase": "Advertising",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-ophelia-en",
      "name": "Ophelia",
      "gender": "feminine",
      "tone": "Expressive, Enthusiastic, Cheerful",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-orion-en",
      "name": "Orion",
      "gender": "masculine",
      "tone": "Approachable, Comfortable, Calm, Polite",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-orpheus-en",
      "name": "Orpheus",
      "gender": "masculine",
      "tone": "Professional, Clear, Confident, Trustworthy",
      "useCase": "Customer Service, Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-pandora-en",
      "name": "Pandora",
      "gender": "feminine",
      "tone": "Smooth, Calm, Melodic, Breathy",
      "useCase": "IVR, Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-phoebe-en",
      "name": "Phoebe",
      "gender": "feminine",
      "tone": "Energetic, Warm, Casual",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-pluto-en",
      "name": "Pluto",
      "gender": "masculine",
      "tone": "Smooth, Calm, Empathetic, Baritone",
      "useCase": "Interview, Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-saturn-en",
      "name": "Saturn",
      "gender": "masculine",
      "tone": "Knowledgeable, Confident, Baritone",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-selene-en",
      "name": "Selene",
      "gender": "feminine",
      "tone": "Expressive, Engaging, Energetic",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-thalia-en",
      "name": "Thalia",
      "gender": "feminine",
      "tone": "Clear, Confident, Energetic, Enthusiastic",
      "useCase": "Casual Chat, Customer Service, IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-theia-en",
      "name": "Theia",
      "gender": "feminine",
      "tone": "Expressive, Polite, Sincere",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-vesta-en",
      "name": "Vesta",
      "gender": "feminine",
      "tone": "Natural, Expressive, Patient, Empathetic",
      "useCase": "Customer Service, Interview, Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-zeus-en",
      "name": "Zeus",
      "gender": "masculine",
      "tone": "Deep, Trustworthy, Smooth",
      "useCase": "IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-agustina-es",
      "name": "Agustina",
      "gender": "feminine",
      "tone": "Calm, Clear, Expressive, Knowledgeable, Professional",
      "useCase": "Interview, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-alvaro-es",
      "name": "Alvaro",
      "gender": "masculine",
      "tone": "Calm, Professional, Clear, Knowledgeable, Approachable",
      "useCase": "Interview, Customer Service",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-antonia-es",
      "name": "Antonia",
      "gender": "feminine",
      "tone": "Approachable, Enthusiastic, Friendly, Natural, Professional",
      "useCase": "Customer Service, Interview, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-aquila-es",
      "name": "Aquila",
      "gender": "masculine",
      "tone": "Expressive, Enthusiastic, Confident, Casual, Comfortable",
      "useCase": "Casual Chat, Informative",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-carina-es",
      "name": "Carina",
      "gender": "feminine",
      "tone": "Professional, Raspy, Energetic, Breathy, Confident",
      "useCase": "Interview, Customer Service, IVR",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-celeste-es",
      "name": "Celeste",
      "gender": "feminine",
      "tone": "Clear, Energetic, Positive, Friendly, Enthusiastic",
      "useCase": "Casual Chat, Advertising, IVR",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-diana-es",
      "name": "Diana",
      "gender": "feminine",
      "tone": "Professional, Confident, Expressive, Polite, Knowledgeable",
      "useCase": "Storytelling, Advertising",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-estrella-es",
      "name": "Estrella",
      "gender": "feminine",
      "tone": "Approachable, Natural, Calm, Comfortable, Expressive",
      "useCase": "Casual Chat, Interview",
      "ageRange": "Mature",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-gloria-es",
      "name": "Gloria",
      "gender": "feminine",
      "tone": "Casual, Clear, Expressive, Natural, Smooth",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-javier-es",
      "name": "Javier",
      "gender": "masculine",
      "tone": "Approachable, Professional, Friendly, Comfortable, Calm",
      "useCase": "Casual Chat, IVR, Storytelling",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-luciano-es",
      "name": "Luciano",
      "gender": "masculine",
      "tone": "Charismatic, Cheerful, Energetic, Expressive, Friendly",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-nestor-es",
      "name": "Nestor",
      "gender": "masculine",
      "tone": "Calm, Professional, Approachable, Clear, Confident",
      "useCase": "Casual Chat, Customer Service",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-olivia-es",
      "name": "Olivia",
      "gender": "feminine",
      "tone": "Breathy, Calm, Casual, Expressive, Warm",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-selena-es",
      "name": "Selena",
      "gender": "feminine",
      "tone": "Approachable, Casual, Friendly, Calm, Positive",
      "useCase": "Customer Service, Informative",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-silvia-es",
      "name": "Silvia",
      "gender": "feminine",
      "tone": "Charismatic, Clear, Expressive, Natural, Warm",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-sirio-es",
      "name": "Sirio",
      "gender": "masculine",
      "tone": "Calm, Professional, Comfortable, Empathetic, Baritone",
      "useCase": "Casual Chat, Interview",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-valerio-es",
      "name": "Valerio",
      "gender": "masculine",
      "tone": "Deep, Knowledgeable, Natural, Polite, Professional",
      "useCase": "Customer Service, Informative",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-beatrix-nl",
      "name": "Beatrix",
      "gender": "feminine",
      "tone": "Cheerful, Enthusiastic, Friendly, Trustworthy, Warm",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-cornelia-nl",
      "name": "Cornelia",
      "gender": "feminine",
      "tone": "Approachable, Friendly, Polite, Positive, Warm",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-daphne-nl",
      "name": "Daphne",
      "gender": "feminine",
      "tone": "Calm, Clear, Confident, Professional, Smooth",
      "useCase": "Healthcare, Interview, Casual Chat, Audiobook",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-hestia-nl",
      "name": "Hestia",
      "gender": "feminine",
      "tone": "Approachable, Caring, Expressive, Friendly, Knowledgeable",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-lars-nl",
      "name": "Lars",
      "gender": "masculine",
      "tone": "Breathy, Casual, Comfortable, Sincere, Trustworthy",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-leda-nl",
      "name": "Leda",
      "gender": "feminine",
      "tone": "Caring, Comfortable, Empathetic, Friendly, Sincere",
      "useCase": "Sales",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-rhea-nl",
      "name": "Rhea",
      "gender": "feminine",
      "tone": "Caring, Knowledgeable, Positive, Smooth, Warm",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-roman-nl",
      "name": "Roman",
      "gender": "masculine",
      "tone": "Calm, Casual, Deep, Natural, Patient",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-sander-nl",
      "name": "Sander",
      "gender": "masculine",
      "tone": "Calm, Clear, Deep, Professional, Smooth",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/dg-aura-2-nl"
    },
    {
      "voiceId": "aura-2-agathe-fr",
      "name": "Agathe",
      "gender": "feminine",
      "tone": "Charismatic, Cheerful, Enthusiastic, Friendly, Natural",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/dg-aura-2-fr"
    },
    {
      "voiceId": "aura-2-hector-fr",
      "name": "Hector",
      "gender": "masculine",
      "tone": "Confident, Empathetic, Expressive, Friendly, Patient",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/dg-aura-2-fr"
    },
    {
      "voiceId": "aura-2-aurelia-de",
      "name": "Aurelia",
      "gender": "feminine",
      "tone": "Approachable, Casual, Comfortable, Natural, Sincere",
      "useCase": "Healthcare, Customer Service, Sales, Financial Services",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/dg-aura-2-de"
    },
    {
      "voiceId": "aura-2-elara-de",
      "name": "Elara",
      "gender": "feminine",
      "tone": "Calm, Clear, Natural, Patient, Trustworthy",
      "useCase": "Healthcare, Customer Service, Sales, Financial Services",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/dg-aura-2-de"
    },
    {
      "voiceId": "aura-2-fabian-de",
      "name": "Fabian",
      "gender": "masculine",
      "tone": "Confident, Knowledgeable, Natural, Polite, Professional",
      "useCase": "Healthcare, Customer Service, Sales, Financial Services",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/dg-aura-2-de"
    },
    {
      "voiceId": "aura-2-julius-de",
      "name": "Julius",
      "gender": "masculine",
      "tone": "Casual, Cheerful, Engaging, Expressive, Friendly",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/dg-aura-2-de"
    },
    {
      "voiceId": "aura-2-kara-de",
      "name": "Kara",
      "gender": "feminine",
      "tone": "Caring, Empathetic, Expressive, Professional, Warm",
      "useCase": "Healthcare, Customer Service, Sales, Financial Services",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/dg-aura-2-de"
    },
    {
      "voiceId": "aura-2-lara-de",
      "name": "Lara",
      "gender": "feminine",
      "tone": "Caring, Cheerful, Empathetic, Expressive, Warm",
      "useCase": "Healthcare, Customer Service, Sales, Financial Services",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/dg-aura-2-de"
    },
    {
      "voiceId": "aura-2-viktoria-de",
      "name": "Viktoria",
      "gender": "feminine",
      "tone": "Charismatic, Cheerful, Enthusiastic, Friendly, Warm",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/dg-aura-2-de"
    },
    {
      "voiceId": "aura-2-cesare-it",
      "name": "Cesare",
      "gender": "masculine",
      "tone": "Clear, Empathetic, Knowledgeable, Natural, Smooth",
      "useCase": "Casual Chat, Customer Service, Interview, IVR",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-cinzia-it",
      "name": "Cinzia",
      "gender": "feminine",
      "tone": "Approachable, Friendly, Smooth, Trustworthy, Warm",
      "useCase": "Customer Service, Interview, Narration",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-demetra-it",
      "name": "Demetra",
      "gender": "feminine",
      "tone": "Calm, Comfortable, Patient",
      "useCase": "Casual Chat, Interview, Narration",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-dionisio-it",
      "name": "Dionisio",
      "gender": "masculine",
      "tone": "Confident, Engaging, Friendly, Melodic, Positive",
      "useCase": "Sales",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-elio-it",
      "name": "Elio",
      "gender": "masculine",
      "tone": "Breathy, Calm, Professional, Smooth, Trustworthy",
      "useCase": "Interview, Casual Chat, Customer Service",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-flavio-it",
      "name": "Flavio",
      "gender": "masculine",
      "tone": "Confident, Deep, Empathetic, Professional, Trustworthy",
      "useCase": "Casual Chat, Interview, Customer Service",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-livia-it",
      "name": "Livia",
      "gender": "feminine",
      "tone": "Approachable, Cheerful, Clear, Engaging, Expressive",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-maia-it",
      "name": "Maia",
      "gender": "feminine",
      "tone": "Caring, Energetic, Expressive, Professional, Warm",
      "useCase": "Interview, Casual Chat, Customer Service",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-melia-it",
      "name": "Melia",
      "gender": "feminine",
      "tone": "Clear, Comfortable, Engaging, Friendly, Natural",
      "useCase": "Casual Chat, Customer Service, Interview",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-perseo-it",
      "name": "Perseo",
      "gender": "masculine",
      "tone": "Casual, Clear, Natural, Polite, Smooth",
      "useCase": "Casual Chat, Customer Service",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/dg-aura-2-it"
    },
    {
      "voiceId": "aura-2-ama-ja",
      "name": "Ama",
      "gender": "feminine",
      "tone": "Casual, Comfortable, Confident, Knowledgeable, Natural",
      "useCase": "Interview, IVR",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/dg-aura-2-ja"
    },
    {
      "voiceId": "aura-2-ebisu-ja",
      "name": "Ebisu",
      "gender": "masculine",
      "tone": "Calm, Deep, Natural, Patient, Sincere",
      "useCase": "Casual Chat, Customer Service",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/dg-aura-2-ja"
    },
    {
      "voiceId": "aura-2-fujin-ja",
      "name": "Fujin",
      "gender": "masculine",
      "tone": "Calm, Confident, Knowledgeable, Professional, Smooth",
      "useCase": "Interview, Casual Chat, IVR",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/dg-aura-2-ja"
    },
    {
      "voiceId": "aura-2-izanami-ja",
      "name": "Izanami",
      "gender": "feminine",
      "tone": "Approachable, Clear, Knowledgeable, Polite, Professional",
      "useCase": "Casual Chat, Customer Service, Interview, IVR",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/dg-aura-2-ja"
    },
    {
      "voiceId": "aura-2-uzume-ja",
      "name": "Uzume",
      "gender": "feminine",
      "tone": "Approachable, Clear, Polite, Professional, Trustworthy",
      "useCase": "Customer Service, Interview, IVR, Commercial",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/dg-aura-2-ja"
    }
  ],
  "slng/deepgram/aura:2-en": [
    {
      "voiceId": "aura-2-amalthea-en",
      "name": "Amalthea",
      "gender": "feminine",
      "tone": "Engaging, Natural, Cheerful",
      "useCase": "Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-andromeda-en",
      "name": "Andromeda",
      "gender": "feminine",
      "tone": "Casual, Expressive, Comfortable",
      "useCase": "Customer Service, IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-apollo-en",
      "name": "Apollo",
      "gender": "masculine",
      "tone": "Confident, Comfortable, Casual",
      "useCase": "Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-arcas-en",
      "name": "Arcas",
      "gender": "masculine",
      "tone": "Natural, Smooth, Clear, Comfortable",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-aries-en",
      "name": "Aries",
      "gender": "masculine",
      "tone": "Warm, Energetic, Caring",
      "useCase": "Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-asteria-en",
      "name": "Asteria",
      "gender": "feminine",
      "tone": "Clear, Confident, Knowledgeable, Energetic",
      "useCase": "Advertising",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-athena-en",
      "name": "Athena",
      "gender": "feminine",
      "tone": "Calm, Smooth, Professional",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-atlas-en",
      "name": "Atlas",
      "gender": "masculine",
      "tone": "Enthusiastic, Confident, Approachable, Friendly",
      "useCase": "Advertising",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-aurora-en",
      "name": "Aurora",
      "gender": "feminine",
      "tone": "Cheerful, Expressive, Energetic",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-callista-en",
      "name": "Callista",
      "gender": "feminine",
      "tone": "Clear, Energetic, Professional, Smooth",
      "useCase": "IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-cordelia-en",
      "name": "Cordelia",
      "gender": "feminine",
      "tone": "Approachable, Warm, Polite",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-cora-en",
      "name": "Cora",
      "gender": "feminine",
      "tone": "Smooth, Melodic, Caring",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-delia-en",
      "name": "Delia",
      "gender": "feminine",
      "tone": "Casual, Friendly, Cheerful, Breathy",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-draco-en",
      "name": "Draco",
      "gender": "masculine",
      "tone": "Warm, Approachable, Trustworthy, Baritone",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-electra-en",
      "name": "Electra",
      "gender": "feminine",
      "tone": "Professional, Engaging, Knowledgeable",
      "useCase": "IVR, Advertising, Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-harmonia-en",
      "name": "Harmonia",
      "gender": "feminine",
      "tone": "Empathetic, Clear, Calm, Confident",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-helena-en",
      "name": "Helena",
      "gender": "feminine",
      "tone": "Caring, Natural, Positive, Friendly, Raspy",
      "useCase": "IVR, Casual Chat",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-hera-en",
      "name": "Hera",
      "gender": "feminine",
      "tone": "Smooth, Warm, Professional",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-hermes-en",
      "name": "Hermes",
      "gender": "masculine",
      "tone": "Expressive, Engaging, Professional",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-hyperion-en",
      "name": "Hyperion",
      "gender": "masculine",
      "tone": "Caring, Warm, Empathetic",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-iris-en",
      "name": "Iris",
      "gender": "feminine",
      "tone": "Cheerful, Positive, Approachable",
      "useCase": "IVR, Advertising, Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-janus-en",
      "name": "Janus",
      "gender": "feminine",
      "tone": "Southern, Smooth, Trustworthy",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-juno-en",
      "name": "Juno",
      "gender": "feminine",
      "tone": "Natural, Engaging, Melodic, Breathy",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-jupiter-en",
      "name": "Jupiter",
      "gender": "masculine",
      "tone": "Expressive, Knowledgeable, Baritone",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-luna-en",
      "name": "Luna",
      "gender": "feminine",
      "tone": "Friendly, Natural, Engaging",
      "useCase": "IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-mars-en",
      "name": "Mars",
      "gender": "masculine",
      "tone": "Smooth, Patient, Trustworthy, Baritone",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-minerva-en",
      "name": "Minerva",
      "gender": "feminine",
      "tone": "Positive, Friendly, Natural",
      "useCase": "Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-neptune-en",
      "name": "Neptune",
      "gender": "masculine",
      "tone": "Professional, Patient, Polite",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-odysseus-en",
      "name": "Odysseus",
      "gender": "masculine",
      "tone": "Calm, Smooth, Comfortable, Professional",
      "useCase": "Advertising",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-ophelia-en",
      "name": "Ophelia",
      "gender": "feminine",
      "tone": "Expressive, Enthusiastic, Cheerful",
      "useCase": "Interview",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-orion-en",
      "name": "Orion",
      "gender": "masculine",
      "tone": "Approachable, Comfortable, Calm, Polite",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-orpheus-en",
      "name": "Orpheus",
      "gender": "masculine",
      "tone": "Professional, Clear, Confident, Trustworthy",
      "useCase": "Customer Service, Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-pandora-en",
      "name": "Pandora",
      "gender": "feminine",
      "tone": "Smooth, Calm, Melodic, Breathy",
      "useCase": "IVR, Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-phoebe-en",
      "name": "Phoebe",
      "gender": "feminine",
      "tone": "Energetic, Warm, Casual",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-pluto-en",
      "name": "Pluto",
      "gender": "masculine",
      "tone": "Smooth, Calm, Empathetic, Baritone",
      "useCase": "Interview, Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-saturn-en",
      "name": "Saturn",
      "gender": "masculine",
      "tone": "Knowledgeable, Confident, Baritone",
      "useCase": "Customer Service",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-selene-en",
      "name": "Selene",
      "gender": "feminine",
      "tone": "Expressive, Engaging, Energetic",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-thalia-en",
      "name": "Thalia",
      "gender": "feminine",
      "tone": "Clear, Confident, Energetic, Enthusiastic",
      "useCase": "Casual Chat, Customer Service, IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-theia-en",
      "name": "Theia",
      "gender": "feminine",
      "tone": "Expressive, Polite, Sincere",
      "useCase": "Informative",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-vesta-en",
      "name": "Vesta",
      "gender": "feminine",
      "tone": "Natural, Expressive, Patient, Empathetic",
      "useCase": "Customer Service, Interview, Storytelling",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    },
    {
      "voiceId": "aura-2-zeus-en",
      "name": "Zeus",
      "gender": "masculine",
      "tone": "Deep, Trustworthy, Smooth",
      "useCase": "IVR",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/dg-aura-2"
    }
  ],
  "slng/deepgram/aura:2-es": [
    {
      "voiceId": "aura-2-agustina-es",
      "name": "Agustina",
      "gender": "feminine",
      "tone": "Calm, Clear, Expressive, Knowledgeable, Professional",
      "useCase": "Interview, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-alvaro-es",
      "name": "Alvaro",
      "gender": "masculine",
      "tone": "Calm, Professional, Clear, Knowledgeable, Approachable",
      "useCase": "Interview, Customer Service",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-antonia-es",
      "name": "Antonia",
      "gender": "feminine",
      "tone": "Approachable, Enthusiastic, Friendly, Natural, Professional",
      "useCase": "Customer Service, Interview, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-aquila-es",
      "name": "Aquila",
      "gender": "masculine",
      "tone": "Expressive, Enthusiastic, Confident, Casual, Comfortable",
      "useCase": "Casual Chat, Informative",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-carina-es",
      "name": "Carina",
      "gender": "feminine",
      "tone": "Professional, Raspy, Energetic, Breathy, Confident",
      "useCase": "Interview, Customer Service, IVR",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-celeste-es",
      "name": "Celeste",
      "gender": "feminine",
      "tone": "Clear, Energetic, Positive, Friendly, Enthusiastic",
      "useCase": "Casual Chat, Advertising, IVR",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-diana-es",
      "name": "Diana",
      "gender": "feminine",
      "tone": "Professional, Confident, Expressive, Polite, Knowledgeable",
      "useCase": "Storytelling, Advertising",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-estrella-es",
      "name": "Estrella",
      "gender": "feminine",
      "tone": "Approachable, Natural, Calm, Comfortable, Expressive",
      "useCase": "Casual Chat, Interview",
      "ageRange": "Mature",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-gloria-es",
      "name": "Gloria",
      "gender": "feminine",
      "tone": "Casual, Clear, Expressive, Natural, Smooth",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-javier-es",
      "name": "Javier",
      "gender": "masculine",
      "tone": "Approachable, Professional, Friendly, Comfortable, Calm",
      "useCase": "Casual Chat, IVR, Storytelling",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-luciano-es",
      "name": "Luciano",
      "gender": "masculine",
      "tone": "Charismatic, Cheerful, Energetic, Expressive, Friendly",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-nestor-es",
      "name": "Nestor",
      "gender": "masculine",
      "tone": "Calm, Professional, Approachable, Clear, Confident",
      "useCase": "Casual Chat, Customer Service",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-olivia-es",
      "name": "Olivia",
      "gender": "feminine",
      "tone": "Breathy, Calm, Casual, Expressive, Warm",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-selena-es",
      "name": "Selena",
      "gender": "feminine",
      "tone": "Approachable, Casual, Friendly, Calm, Positive",
      "useCase": "Customer Service, Informative",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-silvia-es",
      "name": "Silvia",
      "gender": "feminine",
      "tone": "Charismatic, Clear, Expressive, Natural, Warm",
      "useCase": "Customer Service, Casual Chat",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-sirio-es",
      "name": "Sirio",
      "gender": "masculine",
      "tone": "Calm, Professional, Comfortable, Empathetic, Baritone",
      "useCase": "Casual Chat, Interview",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    },
    {
      "voiceId": "aura-2-valerio-es",
      "name": "Valerio",
      "gender": "masculine",
      "tone": "Deep, Knowledgeable, Natural, Polite, Professional",
      "useCase": "Customer Service, Informative",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/dg-aura-2-es"
    }
  ],
  "slng/canopylabs/orpheus:en": [
    {
      "voiceId": "tara",
      "name": "Tara",
      "gender": "feminine",
      "tone": "Conversational, Clear",
      "useCase": "Podcasts, AI Assistants, Interviews",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    },
    {
      "voiceId": "leah",
      "name": "Leah",
      "gender": "feminine",
      "tone": "Warm, Gentle",
      "useCase": "Wellness Apps, Audiobooks, Meditation",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    },
    {
      "voiceId": "jess",
      "name": "Jess",
      "gender": "feminine",
      "tone": "Energetic, Youthful",
      "useCase": "Social Content, Ads, Upbeat Narration",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    },
    {
      "voiceId": "leo",
      "name": "Leo",
      "gender": "masculine",
      "tone": "Authoritative, Deep",
      "useCase": "News, Corporate Narration, Documentaries",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    },
    {
      "voiceId": "dan",
      "name": "Dan",
      "gender": "masculine",
      "tone": "Friendly, Casual",
      "useCase": "Tutorials, Explainer Videos, Chatbots",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    },
    {
      "voiceId": "mia",
      "name": "Mia",
      "gender": "feminine",
      "tone": "Professional, Articulate",
      "useCase": "E-learning, Corporate Training, Presentations",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    },
    {
      "voiceId": "zac",
      "name": "Zac",
      "gender": "masculine",
      "tone": "Enthusiastic, Dynamic",
      "useCase": "Sports, Gaming, Promos",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    },
    {
      "voiceId": "zoe",
      "name": "Zoe",
      "gender": "feminine",
      "tone": "Calm, Soothing",
      "useCase": "Relaxation Apps, Gentle Narration",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/orpheus-en"
    }
  ],
  "rime/arcana:en": [
    {
      "voiceId": "ahmed_mohamed",
      "name": "Mohamed Ahmed",
      "gender": "non-binary",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "albion",
      "name": "Albion",
      "gender": "masculine",
      "tone": "English, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "andersen_johan",
      "name": "Johan Andersen",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "anderson_emily",
      "name": "Emily Anderson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "anderson_jake",
      "name": "Jake Anderson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "anderson_james",
      "name": "James Anderson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "anderson_kevin",
      "name": "Kevin Anderson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "andromeda",
      "name": "Andromeda",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "arcade",
      "name": "Arcade",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "astra",
      "name": "Astra",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "atrium",
      "name": "Atrium",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "bauer_felix",
      "name": "Felix Bauer",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "bennett_emily",
      "name": "Emily Bennett",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "bennett_ryan",
      "name": "Ryan Bennett",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "biondi_paul",
      "name": "Paul Biondi",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "bond",
      "name": "Bond",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "brooks_jordan",
      "name": "Jordan Brooks",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "brown_alex",
      "name": "Alex Brown",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "brown_joshua",
      "name": "Joshua Brown",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "brown_madison",
      "name": "Madison Brown",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "brown_matthew",
      "name": "Matthew Brown",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "brown_steven",
      "name": "Steven Brown",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "bruno_katie",
      "name": "Katie Bruno",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "carter_colin",
      "name": "Colin Carter",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "celeste",
      "name": "Celeste",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "chatterjee_rini",
      "name": "Rini Chatterjee",
      "gender": "feminine",
      "tone": "Indian Heritage",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "chen_david",
      "name": "David Chen",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "chen_mei",
      "name": "Mei Chen",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "clark_tyler",
      "name": "Tyler Clark",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "cohen_emily",
      "name": "Emily Cohen",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "cohen_jared",
      "name": "Jared Cohen",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "collins_emily",
      "name": "Emily Collins",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "cooper_logan",
      "name": "Logan Cooper",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "cupola",
      "name": "Cupola",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "das_sourav",
      "name": "Sourav Das",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "davies_james",
      "name": "James Davies",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "dela_cristina",
      "name": "Cristina Dela",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "diallo_amara",
      "name": "Amara Diallo",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "dubois_emma",
      "name": "Emma Dubois",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "duncan_colin",
      "name": "Colin Duncan",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "duval_pierre",
      "name": "Pierre Duval",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "eliphas",
      "name": "Eliphas",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "estelle",
      "name": "Estelle",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "esther",
      "name": "Esther",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "eucalyptus",
      "name": "Eucalyptus",
      "gender": "feminine",
      "tone": "Australian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "evans_jason",
      "name": "Jason Evans",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "fern",
      "name": "Fern",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "fernandez_carlos",
      "name": "Carlos Fernandez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "goldberg_ryan",
      "name": "Ryan Goldberg",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gomez_daniela",
      "name": "Daniela Gomez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gomez_diego",
      "name": "Diego Gomez",
      "gender": "masculine",
      "tone": "Nicaraguan Heritage",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gomez_isabel",
      "name": "Isabel Gomez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gomez_isabella",
      "name": "Isabella Gomez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gomez_javon",
      "name": "Javon Gomez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gonzalez_maya",
      "name": "Maya Gonzalez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gonzalez_michael",
      "name": "Michael Gonzalez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "gonzalez_ryan",
      "name": "Ryan Gonzalez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "grayson_avery",
      "name": "Avery Grayson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "hanson_ryan",
      "name": "Ryan Hanson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "harris_luke",
      "name": "Luke Harris",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "harris_lynette",
      "name": "Lynette Harris",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "harrison_brianna",
      "name": "Brianna Harrison",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "harrison_joey",
      "name": "Joey Harrison",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "harrison_mary",
      "name": "Mary Harrison",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "hassan_omar",
      "name": "Omar Hassan",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "henderson_brittney",
      "name": "Brittney Henderson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "hernandez_juanita",
      "name": "Juanita Hernandez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "holliday_jewel",
      "name": "Jewel Holliday",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "iyer_arun",
      "name": "Arun Iyer",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "jensen_mikkel",
      "name": "Mikkel Jensen",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnny_jackson",
      "name": "Jackson Johnny",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_angela",
      "name": "Angela Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_asha",
      "name": "Asha Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_avery",
      "name": "Avery Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_brianna",
      "name": "Brianna Johnson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_cynthia",
      "name": "Cynthia Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_elijah",
      "name": "Elijah Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_james",
      "name": "James Johnson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_joshua",
      "name": "Joshua Johnson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_latisha",
      "name": "Latisha Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_lisa",
      "name": "Lisa Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_madison",
      "name": "Madison Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_malachi",
      "name": "Malachi Johnson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_marcel",
      "name": "Marcel Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_mary",
      "name": "Mary Johnson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_matthew",
      "name": "Matthew Johnson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_melissa",
      "name": "Melissa Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_monique",
      "name": "Monique Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_nia",
      "name": "Nia Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_tasha",
      "name": "Tasha Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_tia",
      "name": "Tia Johnson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "johnson_walter",
      "name": "Walter Johnson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kelly_aoife",
      "name": "Aoife Kelly",
      "gender": "feminine",
      "tone": "Irish",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kelly_jennifer",
      "name": "Jennifer Kelly",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kelly_john",
      "name": "John Kelly",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kelly_maureen",
      "name": "Maureen Kelly",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "khan_fatima",
      "name": "Fatima Khan",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "khan_umar",
      "name": "Umar Khan",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kim_ashley",
      "name": "Ashley Kim",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kim_daniel",
      "name": "Daniel Kim",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kim_sunny",
      "name": "Sunny Kim",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "kima",
      "name": "Kima",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "lee_sarah",
      "name": "Sarah Lee",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "levi_david",
      "name": "David Levi",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "levine_emily",
      "name": "Emily Levine",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "levine_joshua",
      "name": "Joshua Levine",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "levy_hannah",
      "name": "Hannah Levy",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "li_xiao",
      "name": "Xiao Li",
      "gender": "masculine",
      "tone": "Chinese Heritage",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "lintel",
      "name": "Lintel",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "luna",
      "name": "Luna",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "lyra",
      "name": "Lyra",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "maguire_jason",
      "name": "Jason Maguire",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "malik_ahmad",
      "name": "Ahmad Malik",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "marinelli_giulia",
      "name": "Giulia Marinelli",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "marlu",
      "name": "Marlu",
      "gender": "masculine",
      "tone": "Australian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "martinez_amber",
      "name": "Amber Martinez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "martinez_ana",
      "name": "Ana Martinez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "martinez_dylan",
      "name": "Dylan Martinez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "martinez_jaime",
      "name": "Jaime Martinez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "martinez_leticia",
      "name": "Leticia Martinez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "martinez_rosa",
      "name": "Rosa Martinez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "martinez_ryan",
      "name": "Ryan Martinez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "masonry",
      "name": "Masonry",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mbunda_james",
      "name": "James Mbunda",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mccarthy_james",
      "name": "James Mccarthy",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mccarthy_teresa",
      "name": "Teresa Mccarthy",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mcdowell_peter",
      "name": "Peter Mcdowell",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mckinley_robert",
      "name": "Robert Mckinley",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mendoza_alonzo",
      "name": "Alonzo Mendoza",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mendoza_jesus",
      "name": "Jesus Mendoza",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "mendoza_luz",
      "name": "Luz Mendoza",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "merritt_jimmy",
      "name": "Jimmy Merritt",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "miller_cameron",
      "name": "Cameron Miller",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "miller_judy",
      "name": "Judy Miller",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "miller_kelsey",
      "name": "Kelsey Miller",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "miller_lisa",
      "name": "Lisa Miller",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "miller_logan",
      "name": "Logan Miller",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "miyamoto_akari",
      "name": "Akari Miyamoto",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "montgomery_elise",
      "name": "Elise Montgomery",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "montgomery_emily",
      "name": "Emily Montgomery",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "morgan_brianna",
      "name": "Brianna Morgan",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "morgan_charles",
      "name": "Charles Morgan",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "morris_colin",
      "name": "Colin Morris",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "morris_james",
      "name": "James Morris",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "morris_leticia",
      "name": "Leticia Morris",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "morris_melvin",
      "name": "Melvin Morris",
      "gender": "masculine",
      "tone": "American, Central American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "morton_daine",
      "name": "Daine Morton",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "moss",
      "name": "Moss",
      "gender": "feminine",
      "tone": "Singaporean, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "moyo_david",
      "name": "David Moyo",
      "gender": "masculine",
      "tone": "British",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "murphy_colin",
      "name": "Colin Murphy",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "murphy_emily",
      "name": "Emily Murphy",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "murphy_grace",
      "name": "Grace Murphy",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "murphy_hannah",
      "name": "Hannah Murphy",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "murphy_liam",
      "name": "Liam Murphy",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "murphy_nolan",
      "name": "Nolan Murphy",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "neal_colin",
      "name": "Colin Neal",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "novak_emily",
      "name": "Emily Novak",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "nowak_joanna",
      "name": "Joanna Nowak",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "nowak_michal",
      "name": "Michal Nowak",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "oculus",
      "name": "Oculus",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "olsson_erik",
      "name": "Erik Olsson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "orion",
      "name": "Orion",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "parapet",
      "name": "Parapet",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "park_minseo",
      "name": "Minseo Park",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "park_sumin",
      "name": "Sumin Park",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "patel_amit",
      "name": "Amit Patel",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "patel_asha",
      "name": "Asha Patel",
      "gender": "feminine",
      "tone": "South Asian",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "pham_daniel",
      "name": "Daniel Pham",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "pilaster",
      "name": "Pilaster",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "pola",
      "name": "Pola",
      "gender": "feminine",
      "tone": "Dominican",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "ramirez_maya",
      "name": "Maya Ramirez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "ramos_raul",
      "name": "Raul Ramos",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "reddy_arjun",
      "name": "Arjun Reddy",
      "gender": "masculine",
      "tone": "Indian Heritage",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "reddy_sunil",
      "name": "Sunil Reddy",
      "gender": "masculine",
      "tone": "Indian Heritage",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "ricci_giulia",
      "name": "Giulia Ricci",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "ricci_lorenzo",
      "name": "Lorenzo Ricci",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "rodrigues_miguel",
      "name": "Miguel Rodrigues",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "rodriguez_carla",
      "name": "Carla Rodriguez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "rodriguez_carlos",
      "name": "Carlos Rodriguez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "rodriguez_eduardo",
      "name": "Eduardo Rodriguez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "rodriguez_isabela",
      "name": "Isabela Rodriguez",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "rodriguez_miguel",
      "name": "Miguel Rodriguez",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "rossi_matteo",
      "name": "Matteo Rossi",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "santos_angelica",
      "name": "Angelica Santos",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "schmidt_joshua",
      "name": "Joshua Schmidt",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "schmidt_julia",
      "name": "Julia Schmidt",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "schmidt_sophie",
      "name": "Sophie Schmidt",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "schneider_eric",
      "name": "Eric Schneider",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "schneider_jack",
      "name": "Jack Schneider",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "sharma_amit",
      "name": "Amit Sharma",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "silva_ana",
      "name": "Ana Silva",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "singh_anjali",
      "name": "Anjali Singh",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "sirius",
      "name": "Sirius",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "smith_heather",
      "name": "Heather Smith",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "smith_lisa",
      "name": "Lisa Smith",
      "gender": "feminine",
      "tone": "British",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "smith_michael",
      "name": "Michael Smith",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "smith_mike",
      "name": "Mike Smith",
      "gender": "masculine",
      "tone": "British",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "stucco",
      "name": "Stucco",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "tauro",
      "name": "Tauro",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "thalassa",
      "name": "Thalassa",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "thomas_sarah",
      "name": "Sarah Thomas",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "thompson_kevin",
      "name": "Kevin Thompson",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "torres_miguel",
      "name": "Miguel Torres",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "tran_david",
      "name": "David Tran",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "tran_jessica",
      "name": "Jessica Tran",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "tran_tu",
      "name": "Tu Tran",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "transom",
      "name": "Transom",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "truss",
      "name": "Truss",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "tupou_leilani",
      "name": "Leilani Tupou",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "ursa",
      "name": "Ursa",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "vashti",
      "name": "Vashti",
      "gender": "feminine",
      "tone": "English, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "vespera",
      "name": "Vespera",
      "gender": "feminine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "walnut",
      "name": "Walnut",
      "gender": "masculine",
      "tone": "American, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "wang_mei",
      "name": "Mei Wang",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "watson_emily",
      "name": "Emily Watson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_anna",
      "name": "Anna Williams",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_brian",
      "name": "Brian Williams",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_darnell",
      "name": "Darnell Williams",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_jennifer",
      "name": "Jennifer Williams",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_jordan",
      "name": "Jordan Williams",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_ryan",
      "name": "Ryan Williams",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_terence",
      "name": "Terence Williams",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "williams_tiffany",
      "name": "Tiffany Williams",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "wilson_emma",
      "name": "Emma Wilson",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "wong_kenny",
      "name": "Kenny Wong",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "wright_cooper",
      "name": "Cooper Wright",
      "gender": "masculine",
      "tone": "South African",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "wright_jason",
      "name": "Jason Wright",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "wright_julianne",
      "name": "Julianne Wright",
      "gender": "feminine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Elder",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "wright_michael",
      "name": "Michael Wright",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    },
    {
      "voiceId": "zhang_mei",
      "name": "Mei Zhang",
      "gender": "feminine",
      "tone": "Chinese Heritage",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/rime-arcana-en"
    }
  ],
  "rime/arcana:es": [
    {
      "voiceId": "aurelio",
      "name": "Aurelio",
      "gender": "masculine",
      "tone": "Heritage, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "celestino",
      "name": "Celestino",
      "gender": "masculine",
      "tone": "Mexican, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "lark",
      "name": "Lark",
      "gender": "feminine",
      "tone": "Spanish, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "luz",
      "name": "Luz",
      "gender": "feminine",
      "tone": "Equadorian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "mar",
      "name": "Mar",
      "gender": "masculine",
      "tone": "Mexican, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "nova",
      "name": "Nova",
      "gender": "feminine",
      "tone": "Colombian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "pola",
      "name": "Pola",
      "gender": "feminine",
      "tone": "Dominican, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "seraphina",
      "name": "Seraphina",
      "gender": "feminine",
      "tone": "Colombian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "sirius",
      "name": "Sirius",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    },
    {
      "voiceId": "ursa",
      "name": "Ursa",
      "gender": "masculine",
      "tone": "American",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/rime-arcana-es"
    }
  ],
  "rime/arcana:fr": [
    {
      "voiceId": "amarante",
      "name": "Amarante",
      "gender": "feminine",
      "tone": "Montreal, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/rime-arcana-fr"
    },
    {
      "voiceId": "aurelie",
      "name": "Aurelie",
      "gender": "feminine",
      "tone": "French, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "fr",
      "sampleDir": "samples/rime-arcana-fr"
    },
    {
      "voiceId": "destin",
      "name": "Destin",
      "gender": "masculine",
      "tone": "French, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "fr",
      "sampleDir": "samples/rime-arcana-fr"
    },
    {
      "voiceId": "morel_marianne",
      "name": "Marianne Morel",
      "gender": "feminine",
      "tone": "French, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/rime-arcana-fr"
    },
    {
      "voiceId": "solstice",
      "name": "Solstice",
      "gender": "feminine",
      "tone": "French, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "fr",
      "sampleDir": "samples/rime-arcana-fr"
    }
  ],
  "rime/arcana:de": [
    {
      "voiceId": "alfhild",
      "name": "Alfhild",
      "gender": "feminine",
      "tone": "German, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleDir": "samples/rime-arcana-de"
    },
    {
      "voiceId": "baldur",
      "name": "Baldur",
      "gender": "masculine",
      "tone": "German, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/rime-arcana-de"
    },
    {
      "voiceId": "kumara",
      "name": "Kumara",
      "gender": "feminine",
      "tone": "German, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/rime-arcana-de"
    },
    {
      "voiceId": "liesel",
      "name": "Liesel",
      "gender": "feminine",
      "tone": "Austrian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/rime-arcana-de"
    },
    {
      "voiceId": "lorelei",
      "name": "Lorelei",
      "gender": "feminine",
      "tone": "German, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleDir": "samples/rime-arcana-de"
    },
    {
      "voiceId": "runa",
      "name": "Runa",
      "gender": "feminine",
      "tone": "German, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleDir": "samples/rime-arcana-de"
    }
  ],
  "rime/arcana:ar": [
    {
      "voiceId": "batin",
      "name": "Batin",
      "gender": "masculine",
      "tone": "Palestinian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/rime-arcana-ar"
    },
    {
      "voiceId": "layla",
      "name": "Layla",
      "gender": "feminine",
      "tone": "Egyptian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/rime-arcana-ar"
    },
    {
      "voiceId": "qadir",
      "name": "Qadir",
      "gender": "masculine",
      "tone": "Egyptian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/rime-arcana-ar"
    },
    {
      "voiceId": "sakina",
      "name": "Sakina",
      "gender": "feminine",
      "tone": "Egyptian, Flagship",
      "useCase": "AI Assistants, General Purpose",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/rime-arcana-ar"
    }
  ],
  "kugelaudio/kugel:1": [
    {
      "voiceId": "980",
      "name": "Marius Behnke",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/980/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTgwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.Sig4lRBy3bedP1H3-GL9AwnDQ0pUT92Q2E9FhTu8ePc",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "979",
      "name": "Sara Wagner",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/979/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTc5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.sXY1HAfkG9BO3nFD1Tev7QLk1x_pNPvjxEHLMRaTP7Q",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "978",
      "name": "Lea Huber",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/978/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTc4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.jguJ6VeS9ouBCjS-Bxln7558Rd2d7N8SyYpm2eCTvQY",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "977",
      "name": "Dominik Grund",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/977/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTc3L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.BnvXSQYTe-THeodbSzIn3WokcNsuJBaBQwHXtaMpEuU",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "976",
      "name": "Tobias Kühn",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/976/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTc2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.kCq6PaF3zcSeqhNLXqXXBoHGlzDcMMwH0NynhNjt-uU",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "974",
      "name": "Selina Netz",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/974/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTc0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.HtoRrPuQCr8NGTgsc5hO3lGiBEmdze10KHNVGBYAzXc",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "973",
      "name": "Anna Martin",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/973/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTczL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.jxQ6h3nFfXYs2nNTBQhWoMA2WHHHchvXodfI00nbTwE",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "972",
      "name": "Tim Schröder",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/972/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvOTcyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.CvGvsq6a9qp3BRcJZebQ1Pv1STzlbZC9aDhVlJ0gCdc",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "480",
      "name": "Carla Brandt",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/480/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDgwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.a6gRaC5ZdIGi-KHZvN23agEp9PXiregxxhsZvR6tzP4",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "476",
      "name": "Greta Winkler",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/476/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDc2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.fz_WuNop7jM9zheJqmqnZYe0BV9TjntfUF6EabmfiWo",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "468",
      "name": "Amelie Kraft",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/468/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDY4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.yJfUg3E73aKtJWa2OfpjlBBKaGHSeAxG2wlg1GZSyZg",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "465",
      "name": "Paula Beckmann",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/465/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDY1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ZBHtTD0JKcXjOluwGxI9FPsgpGlifK7mQhUnp-3Ppoc",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "462",
      "name": "Renate Haas",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/462/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDYyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ET-st0JdA28XCYtiNxckN473n1qd91nnsMi6ZckBMYg",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "460",
      "name": "Tobias Kraft",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/460/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDYwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ef7ZSzhEyS_pp2LleiRQZi2SWzdSHroMiq1InxqBZZE",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "458",
      "name": "Monika Weiß",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/458/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDU4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.kxDdBO0kHbOio0NLyenoFcOpQ5jmTLiXX7b8p_-U47c",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "450",
      "name": "Lisa Hofmann",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/450/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDUwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.d-IC3PSAR-eWZJ63S_pZxU7-rWWUSByZL9_n330uquw",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "448",
      "name": "Andreas Schwarz",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/448/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDQ4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ZK9aIVq0cRVDn39_RaLT5CjkOqifHjiIebPy7QIl_zw",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "446",
      "name": "Hannah Vogel",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/446/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDQ2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.wgHWWWpsVAQIEyVqtqnPvL7VYMyKrWu3tuAqbyiNLyI",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "439",
      "name": "Christine Kühn",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/439/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDM5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.BUgc7iVxJT3HxVr3h3rEgm6rTEyfgXCG0czMCVtU6AU",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "438",
      "name": "Sabine Neumann",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/438/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDM4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.gaghvvpIeBAs32c8143JOLSVbKhOS0Y3ewNRrz6HkkM",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "436",
      "name": "Patrick Müller",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/436/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDM2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.onx9Rjnhenfgw_BzWS-KH35o-ENANScpD5xRtmVhzYA",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "422",
      "name": "Elisabeth Fuchs",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/422/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDIyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.5L7ojap8fKz8DCODQHkjm49Cfhj8oW9rodHqM91O1Pc",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "420",
      "name": "Niklas Bauer",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/420/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDIwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.6KRc_HYPXxLOO_vfvfPJWVbHD93mAdPDNdpFNy0jeuI",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "416",
      "name": "Jan Schulz",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/416/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDE2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.2X6rtQYbH7t-69lLIoY02vhcdoJmCIMXYEp9uNIhiIg",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "413",
      "name": "Lukas Ehlers",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/413/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDEzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.4v9RDWTrUva3ujK6nBdV3yeTnbHkvKqBdlE4hhlBVNI",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "412",
      "name": "Felix Richter",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/412/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDEyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.F0yw1dfVrtgJ2F2gC7QwkGHKPxy8maS0E6vytXTxbn8",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "410",
      "name": "Anna Hoffmann",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/410/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDEwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.Pnq_dphkLvmHBqw6aJ2g20nsVxD9itprY0to8QM3fHc",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "409",
      "name": "Helmut Drechsler",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/409/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDA5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.t_KXJOVYBViCeyfZqNHCCoA0XcyuV8cVWnS89FBp9rM",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "404",
      "name": "Markus Lehmann",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/404/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDA0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.3qw4nqNZktOMm2RjWxrDoPzw37i8bjz4SCvEGcvBO0s",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "402",
      "name": "Lena Berger",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/402/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNDAyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0._m0nJPPuXVK19w3-Fa_ICRIh2xoYpRrRI3kgcKGF5tw",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "283",
      "name": "Notfallsystem",
      "gender": "feminine",
      "tone": "advertisement",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/283/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjgzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.B2ExrZ-qIfvpQ44GtY02hg5uWCf3-npvUCD2GcqA24s",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "282",
      "name": "Otto der Vorleser",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/282/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjgyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.5rEcE63hhFVT8LwmaN5Yk7GIK4NbdtfdP3-_ouS2rN0",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "281",
      "name": "Suffi Thomas",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/281/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjgxL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.2YRqqCSoO0U0AtYnKOTA1JyXalEH4Ce-1p33i7LlbQQ",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "280",
      "name": "Johann",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/280/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjgwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.g8W3c9O7o91Zi8TTQHGkjZcDownQS9NB8LmlTRaBaaE",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "279",
      "name": "Markus der Analyst",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/279/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjc5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.JzAfyjzt8CY0zN7d0YrcBfZrVWYXBHX3URDdABEZirQ",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "277",
      "name": "Radio Lars",
      "gender": "masculine",
      "tone": "advertisement",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/277/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjc3L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.XATNRz2UCf5MxxsnTot6J4C2QrPDvsldWk7Zzyctny8",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "276",
      "name": "Jens",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/276/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjc2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.zX4WbyTZGCCyfnnL7CIXKyjech8ko65PokOtRlcZ5yI",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "274",
      "name": "Heinrich",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/274/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjc0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.QUNlOZfyx9XKtGIK-guX4I0keOfS0J72J_rPGzhRtmQ",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "273",
      "name": "Rita die Vorleserin",
      "gender": "non-binary",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/273/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjczL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.-7blniHd46FCQ6RPhf6AdPhwjHPP3lPn0qE-GCYG2-w",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "272",
      "name": "Friedrich",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/272/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjcyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.Cx6Knas3awAZC4JKUFAeVxdxr-UDSD5dY_elwuddRRE",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "271",
      "name": "Johann",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/271/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjcxL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.UugGQwunJtWO_70t5K4mE_HKngkthIpD0bV_1y6GMVk",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "270",
      "name": "Friedrich Sänger",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/270/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjcwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.a-mA0Ti5hzRYmrH3mG3xLKcXEngnQB_YDlIxWuqGWus",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "269",
      "name": "Heinrich",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/269/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjY5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.o1OUWNYjMdj5V43gGOpctN82d-wa3UWxYWoHBTqH748",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "268",
      "name": "Hans",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/268/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjY4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.WH_jYZEAVUSkvJLFHBmfWaXhg22-Hll5tpenOLQEHzk",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "267",
      "name": "Heike die Vorleserin",
      "gender": "feminine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/267/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjY3L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.TGLWjEPWa9gTix2hSMLDUgnNVsdhO0CENMgRFEksOR0",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "266",
      "name": "Petra die Vorleserin",
      "gender": "feminine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/266/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjY2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.Kfr-l9H1x_VNMiZl6QTO8u9LIrZY0VgyTKM1Ya9tR9Y",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "265",
      "name": "Angela Österreicherin",
      "gender": "feminine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/265/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjY1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.nYuKaaJIhf6tR3l2JJVZgCwpG7v1RhA4jK4n-l1WcFY",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "264",
      "name": "Katrin",
      "gender": "feminine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/264/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjY0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.FzQjGvrQtOx7sZqmQC3yBPUgP_5fU3-wTfpwZbBNe3s",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "263",
      "name": "Österreichische Irmgard",
      "gender": "feminine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/263/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjYzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.wy-xCI-_5yDAbttfNJAWEw52Bzffc-35RhmDptLnAIU",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "262",
      "name": "Hans",
      "gender": "masculine",
      "tone": "characters_animation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/262/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjYyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzUsImV4cCI6MTc3NjI2ODAzNX0.HrKdxzamZ5grx19s3cHBH_XnIF6KWyPUB32mMfcFxCk",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "261",
      "name": "Sauerer Felix",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/261/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjYxL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzUsImV4cCI6MTc3NjI2ODAzNX0.v-liFXBvUmentB_MCXv0RyJKJulXRi0ntVwpv1yfl5g",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "259",
      "name": "Verrückter Bernd",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/259/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjU5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzUsImV4cCI6MTc3NjI2ODAzNX0.MZkcp47FgqWihTW8DJR3RShOR9Y50S6eUDjiqBh1Pxk",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "258",
      "name": "Lukas der Flüsterer",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/258/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjU4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzUsImV4cCI6MTc3NjI2ODAzNX0.z9KRym1wIH5D1se-eTGlfNGxAAlfwz_gA1ZQ-cx4fio",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "256",
      "name": "Jörg",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/256/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjU2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzUsImV4cCI6MTc3NjI2ODAzNX0.DL4tWuMsMQye3YfE1kfIFxrjbmaGB8wgtfZCkDcEkno",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "255",
      "name": "Durchsage",
      "gender": "masculine",
      "tone": "narrative_story",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/255/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjU1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzUsImV4cCI6MTc3NjI2ODAzNX0.ja-TbVRlN9vH_pCK1vx89J2XkcM57dlpDefutiD8n_A",
      "sampleDir": "samples/kugel-1-de"
    },
    {
      "voiceId": "293",
      "name": "Fred",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/293/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjkzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.yPeyl2LIx8S9d3SObytdINFn_yNch7v8KBS5GzG3BxM",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "292",
      "name": "Gustav",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/292/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjkyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.WIT6WjndHsjjkSAnQWH21OKhbLehCbAOxHLf86NQT30",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "290",
      "name": "Edina",
      "gender": "feminine",
      "tone": "informative_educational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/290/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjkwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.TI_KuqPcfmXC0UC60Ox3i-0IoOIkWJn29jeKFGOIGjY",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "289",
      "name": "Lukas Storyteller",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Elder",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/289/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjg5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.UC4RZzwoeGH9tWYxmslOraPy8i5mGCpcUcO0MAzOV68",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "287",
      "name": "Chucker",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/287/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjg3L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.Ay7CwX9dPlXIf0hjje1NigBCRBHXmfLfJazFkH4HCtA",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "286",
      "name": "Tim",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/286/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjg2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.H9xlz3JXvoWcvUaUbcWr8zZrJYk9qX8zIpFJwipPoKE",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "285",
      "name": "Angela Teacher",
      "gender": "feminine",
      "tone": "informative_educational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/285/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjg1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.wh6XHFoFGSQ04v8o8Q--Rb0JPI8SLXpZhlT_QvPtOI4",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "284",
      "name": "Justin News Anchor",
      "gender": "masculine",
      "tone": "entertainment_tv",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/284/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvMjg0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.kWZwssOwtHGnd_6IKSkAUI99am6KHIhSOkQa_bb0vXk",
      "sampleDir": "samples/kugel-1-en"
    },
    {
      "voiceId": "595",
      "name": "Héctor Aguilar",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/595/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTk1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.iEuFc2hIhsiI8kxoCuJI_gLNnLeWK6uzBXVHfkJj8wI",
      "sampleDir": "samples/kugel-1-es"
    },
    {
      "voiceId": "594",
      "name": "Carlos Fernández",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/594/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTk0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.Goh4ZkcGN-HzSQqtqBTuHYvAeNu-gz76OyJ4dmtWWI4",
      "sampleDir": "samples/kugel-1-es"
    },
    {
      "voiceId": "592",
      "name": "Isabel Torres",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/592/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTkyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.r11cfIyqMsFn3V67zdRGXRLwVod0XUCGo6WTxU6eaBc",
      "sampleDir": "samples/kugel-1-es"
    },
    {
      "voiceId": "588",
      "name": "Paula Vega",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/588/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTg4L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.STfQZb03yCa_k7dIt2uQwrjoQkMRkZ0D7CxPrZ2Tf9A",
      "sampleDir": "samples/kugel-1-es"
    },
    {
      "voiceId": "736",
      "name": "Nicolas Leroy",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/736/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzM2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.waHj6YbjZPyjzmNzXArsWmidIppRwpRoiB2kdLcYldA",
      "sampleDir": "samples/kugel-1-fr"
    },
    {
      "voiceId": "735",
      "name": "Julien Faure",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/735/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzM1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ZBhUNL7c8qgX_nam3TaeS8eySEwqJg_WZO5q3bE29x0",
      "sampleDir": "samples/kugel-1-fr"
    },
    {
      "voiceId": "734",
      "name": "Manon Petit",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/734/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzM0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.3k1DbT0Gz0gJa1EjqC2zGxL_Z-IqlfnC4i_w7H8GbRw",
      "sampleDir": "samples/kugel-1-fr"
    },
    {
      "voiceId": "732",
      "name": "Camille Dupont",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/732/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzMyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.MCPhFFNqEj9b6iJC75op_8NwKGZfHKwaL32OK7XakRU",
      "sampleDir": "samples/kugel-1-fr"
    },
    {
      "voiceId": "966",
      "name": "Claudy Focan",
      "gender": "masculine",
      "tone": "characters_animation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/kugel-1-fr"
    },
    {
      "voiceId": "685",
      "name": "Simone Barbieri",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/685/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjg1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.dV8DvhybmtEyhLM5oev7TcKdhicT3i2wEZoOHcWcBZ8",
      "sampleDir": "samples/kugel-1-it"
    },
    {
      "voiceId": "684",
      "name": "Alessandro Ricci",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/684/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjg0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.-E5sIopA-NscZC3UkO57Als6icRJK1PS6wmc6VQMPBU",
      "sampleDir": "samples/kugel-1-it"
    },
    {
      "voiceId": "683",
      "name": "Valentina Bruna",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/683/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjgzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.JEgD7J9cmiFG9NsHad1hj0wIFuCUD2748RYZGseo_yo",
      "sampleDir": "samples/kugel-1-it"
    },
    {
      "voiceId": "682",
      "name": "Beatrice Serra ",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/682/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjgyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.gMS_LYrTYEL42w_7kaqMNuI40fju9TrbukEPAZyph-Y",
      "sampleDir": "samples/kugel-1-it"
    },
    {
      "voiceId": "606",
      "name": "Mariana Ferreira",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/606/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjA2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.lL4POVG8iNRBAOI2dw45w58T4-QlYb6OrTb_kRk-Jl0",
      "sampleDir": "samples/kugel-1-pt"
    },
    {
      "voiceId": "604",
      "name": "André Cardoso",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/604/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjA0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.TSF2o8x5h5Z9svymx_VetMlVpyionI0lduA9XvNFyoQ",
      "sampleDir": "samples/kugel-1-pt"
    },
    {
      "voiceId": "603",
      "name": "Marcelo Teixeira",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/603/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjAzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.UxQNQfjyMYSw4jsaFCwc3Td3RmDutGM1jN6390YHgEY",
      "sampleDir": "samples/kugel-1-pt"
    },
    {
      "voiceId": "601",
      "name": "Daniela Campos",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/601/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNjAxL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.mCcPFQt6cbhveCsXBQe1OuZxy1r6rGXEtNuCM-WaFDk",
      "sampleDir": "samples/kugel-1-pt"
    },
    {
      "voiceId": "741",
      "name": "Jakub Dvořák",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/741/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzQxL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ECLxaVuVzjJ6vksMRz1W8G1ESqW-eWmIeQa_-d3LGNE",
      "sampleDir": "samples/kugel-1-cs"
    },
    {
      "voiceId": "740",
      "name": "Tomáš Horák",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/740/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzQwL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ZawRBByLji76Nz2LjdJyIq-94oih3jOB3RfK00JBBV0",
      "sampleDir": "samples/kugel-1-cs"
    },
    {
      "voiceId": "739",
      "name": "Veronika Benešová",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/739/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzM5L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.ZRxdtmVNWawu0uq4UEiR-M0pNFFIr6xyC8dk-Oa_EFA",
      "sampleDir": "samples/kugel-1-cs"
    },
    {
      "voiceId": "737",
      "name": "Tereza Nováková",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/737/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzM3L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.WLKZm4nsrQTKf6qtDl7abchJXkJQEfYbmX6Fnj0jA0M",
      "sampleDir": "samples/kugel-1-cs"
    },
    {
      "voiceId": "586",
      "name": "Zeynep Arslan",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/586/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTg2L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.NYRdyl_XiVDA7UQuzJANrzPve5Xjpb4Dcv61mN9zUwM",
      "sampleDir": "samples/kugel-1-tr"
    },
    {
      "voiceId": "585",
      "name": "Seda_Aktaş",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/585/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTg1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.-oyQbBZMfJS-Hhgg89EXIqVmibDQZOvt33AQ-rHBS-0",
      "sampleDir": "samples/kugel-1-tr"
    },
    {
      "voiceId": "584",
      "name": "Mehmet Kaya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/584/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTg0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.XJ2w10jBu9UmHWcZrVDoimGsg41H6ZI7yxEdwyXPd6w",
      "sampleDir": "samples/kugel-1-tr"
    },
    {
      "voiceId": "583",
      "name": "İbrahim Yıldız",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/583/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNTgzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.3bOnOqkSQoIaNAvmttMBVTN7ezYW4UYcEZSYF1k_T9k",
      "sampleDir": "samples/kugel-1-tr"
    },
    {
      "voiceId": "745",
      "name": "Krzysztof Wiśniewski",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/745/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzQ1L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.wynvCIbY_Ydu1DtPilrXloR0auXLW3gbn6j1y9pK2WI",
      "sampleDir": "samples/kugel-1-pl"
    },
    {
      "voiceId": "744",
      "name": "Dawid Kwiatkowski",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/744/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzQ0L3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.YVUl3jAMk89yYHiUGl5gM0D3jLzon0XYhV1dWSkmQl0",
      "sampleDir": "samples/kugel-1-pl"
    },
    {
      "voiceId": "743",
      "name": "Katarzyna Lewandowska",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/743/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzQzL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.CSqebl4Uc3luVD_SgI6MUAvYlwcZEFAS0CZ113zkJtk",
      "sampleDir": "samples/kugel-1-pl"
    },
    {
      "voiceId": "742",
      "name": "Dominika Nowak",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleUrl": "https://auth.kugelaudio.com/storage/v1/object/sign/voices/742/sample.wav?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2b2ljZXMvNzQyL3NhbXBsZS53YXYiLCJpYXQiOjE3NzYyNjQ0MzQsImV4cCI6MTc3NjI2ODAzNH0.mp989BqlmlkSokNpSfrpqS7w63Wj3ksx37obSD3nhuM",
      "sampleDir": "samples/kugel-1-pl"
    },
    {
      "voiceId": "913",
      "name": "Hanna Kuiper",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/kugel-1-nl"
    },
    {
      "voiceId": "912",
      "name": "Rosa van den Berg",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/kugel-1-nl"
    },
    {
      "voiceId": "911",
      "name": "Lars de Vries",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/kugel-1-nl"
    },
    {
      "voiceId": "910",
      "name": "Daan Mulder",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/kugel-1-nl"
    },
    {
      "voiceId": "850",
      "name": "Katja Breznik",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sl",
      "sampleDir": "samples/kugel-1-sl"
    },
    {
      "voiceId": "849",
      "name": "Ana Novak",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sl",
      "sampleDir": "samples/kugel-1-sl"
    },
    {
      "voiceId": "848",
      "name": "Matej Kovač ",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sl",
      "sampleDir": "samples/kugel-1-sl"
    },
    {
      "voiceId": "847",
      "name": "Andrej Potočnik",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sl",
      "sampleDir": "samples/kugel-1-sl"
    }
  ],
  "murf/murftts:falcon": [
    {
      "voiceId": "en-AU-ashton",
      "name": "Ashton",
      "gender": "masculine",
      "tone": "Narration, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-evelyn",
      "name": "Evelyn",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-harper",
      "name": "Harper",
      "gender": "masculine",
      "tone": "Casual, Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-ivy",
      "name": "Ivy",
      "gender": "feminine",
      "tone": "Angry, Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-jimm",
      "name": "Jimm",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-joyce",
      "name": "Joyce",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-kylie",
      "name": "Kylie",
      "gender": "feminine",
      "tone": "Calm, Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-leyton",
      "name": "Leyton",
      "gender": "masculine",
      "tone": "Angry, Calm, Conversational, Inspirational, Narration, Newscast, Promo, Sad, Terrified",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-mitch",
      "name": "Mitch",
      "gender": "masculine",
      "tone": "Casual, Conversational, Narration, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-shane",
      "name": "Shane",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-AU-sophia",
      "name": "Sophia",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-IN-aarav",
      "name": "Aarav",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-IN-alia",
      "name": "Alia",
      "gender": "feminine",
      "tone": "Documentary, Narration, Promo, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-IN-arohi",
      "name": "Arohi",
      "gender": "feminine",
      "tone": "Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-IN-eashwar",
      "name": "Eashwar",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-IN-isha",
      "name": "Isha",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational, Narration, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational, Narration, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-SCOTT-emily",
      "name": "Emily",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-SCOTT-rory",
      "name": "Rory",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-aiden",
      "name": "Aiden",
      "gender": "masculine",
      "tone": "Character, Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-amber",
      "name": "Amber",
      "gender": "feminine",
      "tone": "Conversational, Documentary",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-finley",
      "name": "Finley",
      "gender": "masculine",
      "tone": "Angry, Conversational, Narration, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-freddie",
      "name": "Freddie",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-gabriel",
      "name": "Gabriel",
      "gender": "masculine",
      "tone": "Documentary, Evil, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-harrison",
      "name": "Harrison",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-hazel",
      "name": "Hazel",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-heidi",
      "name": "Heidi",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-hugo",
      "name": "Hugo",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-jaxon",
      "name": "Jaxon",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-juliet",
      "name": "Juliet",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-katie",
      "name": "Katie",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-mason",
      "name": "Mason",
      "gender": "masculine",
      "tone": "Conversational, Documentary",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-pearl",
      "name": "Pearl",
      "gender": "feminine",
      "tone": "Conversational, Storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-peter",
      "name": "Peter",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-reggie",
      "name": "Reggie",
      "gender": "masculine",
      "tone": "Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-ruby",
      "name": "Ruby",
      "gender": "feminine",
      "tone": "Angry, Calm, Conversational, Newscast, Promo, Sad, Whispering",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-UK-theo",
      "name": "Theo",
      "gender": "masculine",
      "tone": "Angry, Calm, Character, Narration, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-abigail",
      "name": "Abigail",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-alicia",
      "name": "Alicia",
      "gender": "feminine",
      "tone": "Angry, Calm, Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-alina",
      "name": "Alina",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-amara",
      "name": "Amara",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-angela",
      "name": "Angela",
      "gender": "feminine",
      "tone": "Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-ariana",
      "name": "Ariana",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-caleb",
      "name": "Caleb",
      "gender": "masculine",
      "tone": "Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-carter",
      "name": "Carter",
      "gender": "masculine",
      "tone": "Calm, Conversational, Documentary, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-charles",
      "name": "Charles",
      "gender": "masculine",
      "tone": "Angry, Calm, Conversational, Inspirational, NewsCast, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-charlotte",
      "name": "Charlotte",
      "gender": "feminine",
      "tone": "Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-claire",
      "name": "Claire",
      "gender": "feminine",
      "tone": "Luxury, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-cooper",
      "name": "Cooper",
      "gender": "masculine",
      "tone": "Angry, Conversational, Inspirational, Newscast, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-daisy",
      "name": "Daisy",
      "gender": "feminine",
      "tone": "Conversational, Narration, NewsCast, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-daniel",
      "name": "Daniel",
      "gender": "masculine",
      "tone": "Conversational, Inspirational, Sad, Storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-delilah",
      "name": "Delilah",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-denzel",
      "name": "Denzel",
      "gender": "masculine",
      "tone": "Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-dylan",
      "name": "Dylan",
      "gender": "masculine",
      "tone": "Conversational, Documentary, Inspirational, Newscast",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-edmund",
      "name": "Edmund",
      "gender": "masculine",
      "tone": "Conversational, Inspirational, NewsCast, Promo, Sad, Sports Commentary",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-evander",
      "name": "Evander",
      "gender": "masculine",
      "tone": "Conversational, Friendly, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-imani",
      "name": "Imani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-iris",
      "name": "Iris",
      "gender": "feminine",
      "tone": "Conversational, Friendly, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-jayden",
      "name": "Jayden",
      "gender": "masculine",
      "tone": "Conversational, Friendly, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-josie",
      "name": "Josie",
      "gender": "feminine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-julia",
      "name": "Julia",
      "gender": "feminine",
      "tone": "Angry, Calm, Conversational, Narration, Newscast, Promo, Sad, Storytelling, Witch",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-june",
      "name": "June",
      "gender": "feminine",
      "tone": "Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-ken",
      "name": "Ken",
      "gender": "masculine",
      "tone": "Angry, Audiobook, Calm, Clown, Conversational, Furious, Newscast, Promo, Sad, Sobbing, Storytelling, Wizard",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-lucas",
      "name": "Lucas",
      "gender": "masculine",
      "tone": "Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-marcus",
      "name": "Marcus",
      "gender": "masculine",
      "tone": "Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-matthew",
      "name": "Matthew",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-maverick",
      "name": "Maverick",
      "gender": "masculine",
      "tone": "Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-michelle",
      "name": "Michelle",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-miles",
      "name": "Miles",
      "gender": "masculine",
      "tone": "Angry, Calm, Conversational, Customer Support Agent, Inspirational, Narration, Newscast, Pirate, Promo, Sad, Sports Commentary, Terrified",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-molly",
      "name": "Molly",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-naomi",
      "name": "Naomi",
      "gender": "feminine",
      "tone": "Conversational, Inspirational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-natalie",
      "name": "Natalie",
      "gender": "feminine",
      "tone": "Angry, Conversational, Furious, Inspirational, Meditative, Narration, Newscast Casual, Newscast Formal, Promo, Sad, Sorrowful, Terrified",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-paul",
      "name": "Paul",
      "gender": "masculine",
      "tone": "Audiobook, Conversational, Narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-phoebe",
      "name": "Phoebe",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-riley",
      "name": "Riley",
      "gender": "feminine",
      "tone": "Narration, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-river",
      "name": "River",
      "gender": "neutral",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-ronnie",
      "name": "Ronnie",
      "gender": "masculine",
      "tone": "Conversational, NewsCast, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-ryan",
      "name": "Ryan",
      "gender": "masculine",
      "tone": "Angry, Conversational, Narration, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-samantha",
      "name": "Samantha",
      "gender": "feminine",
      "tone": "Angry, Conversational, Luxury, Newscast, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-terrell",
      "name": "Terrell",
      "gender": "masculine",
      "tone": "Calm, Conversational, Inspirational, Narration, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-wayne",
      "name": "Wayne",
      "gender": "masculine",
      "tone": "Angry, Calm, Conversational, Inspirational, Narration, NewsCast, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "en-US-zion",
      "name": "Zion",
      "gender": "masculine",
      "tone": "Conversational, Narration, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "en",
      "sampleDir": "samples/murf-falcon-en"
    },
    {
      "voiceId": "fr-CA-alexis",
      "name": "Alexis",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-CA-amara",
      "name": "Amara",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-CA-clément",
      "name": "Clément",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-adélie",
      "name": "Adélie",
      "gender": "feminine",
      "tone": "Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-amara",
      "name": "Amara",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-axel",
      "name": "Axel",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-guillaume",
      "name": "Guillaume",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-justine",
      "name": "Justine",
      "gender": "feminine",
      "tone": "Angry, Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-louis",
      "name": "Louis",
      "gender": "masculine",
      "tone": "Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-louise",
      "name": "Louise",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "fr-FR-maxime",
      "name": "Maxime",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "fr",
      "sampleDir": "samples/murf-falcon-fr"
    },
    {
      "voiceId": "es-ES-carla",
      "name": "Carla",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-ES-carmen",
      "name": "Carmen",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-ES-elvira",
      "name": "Elvira",
      "gender": "feminine",
      "tone": "Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-ES-enrique",
      "name": "Enrique",
      "gender": "masculine",
      "tone": "Calm, Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-ES-javier",
      "name": "Javier",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-MX-alejandro",
      "name": "Alejandro",
      "gender": "masculine",
      "tone": "Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-MX-carlos",
      "name": "Carlos",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-MX-luisa",
      "name": "Luisa",
      "gender": "feminine",
      "tone": "Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "es-MX-valeria",
      "name": "Valeria",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "es",
      "sampleDir": "samples/murf-falcon-es"
    },
    {
      "voiceId": "it-IT-amara",
      "name": "Amara",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-angelo",
      "name": "Angelo",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-giorgio",
      "name": "Giorgio",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-giulia",
      "name": "Giulia",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-greta",
      "name": "Greta",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-lorenzo",
      "name": "Lorenzo",
      "gender": "masculine",
      "tone": "Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-ronnie",
      "name": "Ronnie",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-vera",
      "name": "Vera",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-vincenzo",
      "name": "Vincenzo",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "it-IT-zion",
      "name": "Zion",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/murf-falcon-it"
    },
    {
      "voiceId": "zh-CN-baolin",
      "name": "Baolin",
      "gender": "feminine",
      "tone": "Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "zh",
      "sampleDir": "samples/murf-falcon-zh"
    },
    {
      "voiceId": "zh-CN-jiao",
      "name": "Jiao",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "zh",
      "sampleDir": "samples/murf-falcon-zh"
    },
    {
      "voiceId": "zh-CN-tao",
      "name": "Tao",
      "gender": "masculine",
      "tone": "Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "zh",
      "sampleDir": "samples/murf-falcon-zh"
    },
    {
      "voiceId": "zh-CN-wei",
      "name": "Wei",
      "gender": "feminine",
      "tone": "Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "zh",
      "sampleDir": "samples/murf-falcon-zh"
    },
    {
      "voiceId": "zh-CN-yuxan",
      "name": "Yuxan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "zh",
      "sampleDir": "samples/murf-falcon-zh"
    },
    {
      "voiceId": "zh-CN-zhang",
      "name": "Zhang",
      "gender": "masculine",
      "tone": "Calm, Conversational, Promo",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "zh",
      "sampleDir": "samples/murf-falcon-zh"
    },
    {
      "voiceId": "hi-IN-aman",
      "name": "Aman",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-ayushi",
      "name": "Ayushi",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-karan",
      "name": "Karan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-khyati",
      "name": "Khyati",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-namrita",
      "name": "Namrita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-shaan",
      "name": "Shaan",
      "gender": "masculine",
      "tone": "Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Young Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-shweta",
      "name": "Shweta",
      "gender": "feminine",
      "tone": "Calm, Conversational, Promo, Sad",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Middle-Aged",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-sunaina",
      "name": "Sunaina",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "hi-IN-zion",
      "name": "Zion",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/murf-falcon-hi"
    },
    {
      "voiceId": "sv-SE-alma",
      "name": "Alma",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/murf-falcon-sv"
    },
    {
      "voiceId": "sv-SE-erik",
      "name": "Erik",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/murf-falcon-sv"
    },
    {
      "voiceId": "mr-IN-arun",
      "name": "Arun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "mr",
      "sampleDir": "samples/murf-falcon-mr"
    },
    {
      "voiceId": "mr-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "mr",
      "sampleDir": "samples/murf-falcon-mr"
    },
    {
      "voiceId": "ml-IN-ananya",
      "name": "Ananya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ml",
      "sampleDir": "samples/murf-falcon-ml"
    },
    {
      "voiceId": "ml-IN-arun",
      "name": "Arun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ml",
      "sampleDir": "samples/murf-falcon-ml"
    },
    {
      "voiceId": "lt-LT-amara",
      "name": "Amara",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "lt",
      "sampleDir": "samples/murf-falcon-lt"
    },
    {
      "voiceId": "lt-LT-ronnie",
      "name": "Ronnie",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "lt",
      "sampleDir": "samples/murf-falcon-lt"
    },
    {
      "voiceId": "lt-LT-zion",
      "name": "Zion",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "lt",
      "sampleDir": "samples/murf-falcon-lt"
    }
  ],
  "cartesia/sonic:3": [
    {
      "voiceId": "002622d8-19d0-4567-a16a-f99c7397c062",
      "name": "Huda - Approachable Speaker",
      "gender": "feminine",
      "tone": "Natural voice for clear, engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "fc923f89-1de5-4ddf-b93c-6da2ba63428a",
      "name": "Nour - Engaging Speaker",
      "gender": "feminine",
      "tone": "Smooth, expressive voice for engaging customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "9cbad5f7-fbf6-4416-a22f-1ecc75ad40a2",
      "name": "Youssef - Clear Communicator",
      "gender": "masculine",
      "tone": "Articulate  delivery designed for seamless instructional content.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "98bf39ce-b44a-49d7-9794-fb9a9329fd11",
      "name": "Rania - Spirited Storyteller",
      "gender": "feminine",
      "tone": "Expressive, lively Arabic female that brings scripts and ads to life.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "731ace69-ee17-41bc-8c6f-665c9f1db95c",
      "name": "Fatima - Graceful Guide",
      "gender": "feminine",
      "tone": "Polite, steady Arabic female for customer service.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "40f9b5d1-bc79-43a6-b5cc-1c692b3b40d2",
      "name": "Zain\t- Dynamic Presenter",
      "gender": "masculine",
      "tone": "Engaging Arabic male that captures attention for customer experience.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "db873303-3a70-4d9d-867a-0d70a6377195",
      "name": "Tariq - Wise Advisor",
      "gender": "masculine",
      "tone": "Calm, measured Arabic male suited for reassuring communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "218a8026-7a26-4dc5-9753-9e75dffe1ea6",
      "name": "Dina - Trusted Advisor",
      "gender": "feminine",
      "tone": "Confident, measured delivery that conveys expertise for communications.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "f1cdfb4a-bf7d-4e83-916e-8f0802278315",
      "name": "Walid - Steady Presence",
      "gender": "masculine",
      "tone": "Warm, confident voice for clear, customer-facing conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "664aec8a-64a4-4437-8a0b-a61aa4f51fe6",
      "name": "Hassan - Authoritative Narrator",
      "gender": "masculine",
      "tone": "Strong, authoritative voice for instructions, narration, and news-style delivery",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "b0aa4612-81d2-4df3-9730-3fc064754b1f",
      "name": "Khalid - Bright Energy",
      "gender": "masculine",
      "tone": "Voice with cheerful tone and expressive clarity, perfect for engaging advertisements and lively…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "9825cf5f-6aff-412a-80c5-bc58a8d55bc4",
      "name": "Maryam - Friendly Voice",
      "gender": "feminine",
      "tone": "Voice with warm, conversational tone and natural rhythm, ideal for approachable conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "6304c635-6681-4f9e-85b6-a97f4d26461a",
      "name": "Amira - Dreamy Whisperer",
      "gender": "feminine",
      "tone": "Calm, soft-spoken adult female for narrations and storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "e3087ad8-7018-4154-9a87-11577f916cd4",
      "name": "Omar - High-Energy Presenter",
      "gender": "masculine",
      "tone": "Lively, energetic adult male for engaging conversations and dynamic narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ar",
      "sampleDir": "samples/cartesia-sonic-3-ar"
    },
    {
      "voiceId": "fcbecbcc-0cef-4615-8b5a-712fe1b39dd0",
      "name": "Ivana - Instruction Provider",
      "gender": "feminine",
      "tone": "Clear and authoritative adult female voice for giving instructions and professional communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "bg",
      "sampleDir": "samples/cartesia-sonic-3-bg"
    },
    {
      "voiceId": "d132064c-b931-4a80-bf0d-02a331ec4572",
      "name": "Georgi - Conversationalist",
      "gender": "masculine",
      "tone": "Friendly adult male with a casual tone for everyday conversations and relatable dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "bg",
      "sampleDir": "samples/cartesia-sonic-3-bg"
    },
    {
      "voiceId": "2ba861ea-7cdc-43d1-8608-4045b5a41de5",
      "name": "Rubel - City Guide",
      "gender": "masculine",
      "tone": "Casual adult male voice for everyday conversations and relatable dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "bn",
      "sampleDir": "samples/cartesia-sonic-3-bn"
    },
    {
      "voiceId": "59ba7dee-8f9a-432f-a6c0-ffb33666b654",
      "name": "Pooja - Everyday Assistant",
      "gender": "feminine",
      "tone": "Soft-spoken adult female voice for casual conversations and natural dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "bn",
      "sampleDir": "samples/cartesia-sonic-3-bn"
    },
    {
      "voiceId": "82db1f84-5b96-4364-b04a-4c7ff80e2f8a",
      "name": "Jan - Capable Coordinator",
      "gender": "masculine",
      "tone": "Clear, professional Czech male for trustworthy customer communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleDir": "samples/cartesia-sonic-3-cs"
    },
    {
      "voiceId": "0b6d3ccb-f421-4e49-80f7-4bfa39f6eb8e",
      "name": "Marek - Steady Specialist",
      "gender": "masculine",
      "tone": "Resonant Czech male with a calm presence for expert support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleDir": "samples/cartesia-sonic-3-cs"
    },
    {
      "voiceId": "b66b3a19-31b3-401f-8b08-40d46a61e4f1",
      "name": "Milena\t- Composed Clarifier",
      "gender": "feminine",
      "tone": "Steady Czech voice for capable professional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleDir": "samples/cartesia-sonic-3-cs"
    },
    {
      "voiceId": "f8685385-96f6-4c12-8520-49e4914bcbfe",
      "name": "Tereza\t- Decisive Agent",
      "gender": "feminine",
      "tone": "Professional adult female for highly structured customer communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleDir": "samples/cartesia-sonic-3-cs"
    },
    {
      "voiceId": "bdc4a3ce-2e22-4398-8cd6-76b7160d2298",
      "name": "Jana - Crisp Conversationalist",
      "gender": "feminine",
      "tone": "Clear and crisp female voice with a casual yet commanding tone for customer support and guidance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleDir": "samples/cartesia-sonic-3-cs"
    },
    {
      "voiceId": "89266bab-6e15-455d-8654-e18c440b0656",
      "name": "Petr - Pastor",
      "gender": "masculine",
      "tone": "Resonant adult male voice, reminiscent of a priest delivering a sermon for narrations and formal…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "cs",
      "sampleDir": "samples/cartesia-sonic-3-cs"
    },
    {
      "voiceId": "a466f9e2-28eb-4bb7-925c-8e8984950700",
      "name": "Søren - Steady Strategist",
      "gender": "masculine",
      "tone": "Steady, Danish male voice for reassuring professional dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "da",
      "sampleDir": "samples/cartesia-sonic-3-da"
    },
    {
      "voiceId": "eb929394-68e7-4e08-bd2f-e7055728a5e1",
      "name": "Mette - Polished Facilitator",
      "gender": "feminine",
      "tone": "Bright, professional Danish female for welcoming customer service.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "da",
      "sampleDir": "samples/cartesia-sonic-3-da"
    },
    {
      "voiceId": "926e0766-f380-4d77-aeb0-9aa4ebb16b38",
      "name": "Soren - Executive Voice",
      "gender": "masculine",
      "tone": "Voice with confident, businesslike tone and clear precision, perfect for professional dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "da",
      "sampleDir": "samples/cartesia-sonic-3-da"
    },
    {
      "voiceId": "c323c793-41f9-47b8-99dc-9b44b0440b84",
      "name": "Katrine - Calm Caregiver",
      "gender": "feminine",
      "tone": "Soft and calm adult female voice for meditation, relaxation, and gentle conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "da",
      "sampleDir": "samples/cartesia-sonic-3-da"
    },
    {
      "voiceId": "b7187e84-fe22-4344-ba4a-bc013fcb533e",
      "name": "Sebastian - Orator",
      "gender": "masculine",
      "tone": "Warm male for audiobooks and clear communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "38aabb6a-f52b-4fb0-a3d1-988518f4dc06",
      "name": "Alina - Engaging Assistant",
      "gender": "feminine",
      "tone": "Warm female for phone systems, virtual assistants, and customer service",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "b9de4a89-2257-424b-94c2-db18ba68c81a",
      "name": "Viktoria - Phone Conversationalist",
      "gender": "feminine",
      "tone": "Clear and smooth female for phone conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "4ad22058-7cb6-402c-a115-196cbfc25dce",
      "name": "Moritz - Modern Communicator",
      "gender": "masculine",
      "tone": "Crisp, approachable German male ideal for digital assistants.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "d1cbea67-e4d3-47cd-be2a-2bd4e646b002",
      "name": "Henrik\t- Steady Analyst",
      "gender": "masculine",
      "tone": "Articulate, dependable German male perfect for business briefings.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "9b4d08b6-0494-4301-ab92-9150f4ee2718",
      "name": "Marlene - Elegant Speaker",
      "gender": "feminine",
      "tone": "Refined, composed German female built for formal announcements.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "40e0f496-a220-46bb-975a-7ef465b3d92b",
      "name": "Vreni - Diligent Advisor",
      "gender": "feminine",
      "tone": "Composed, Swiss-German female for professional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "384b625b-da5d-49e8-a76d-a2855d4f31eb",
      "name": "Thomas - Anchor",
      "gender": "masculine",
      "tone": "Earnest male for conversations and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "4ab1ff51-476d-42bb-8019-4d315f7c0c05",
      "name": "Lena - Muse",
      "gender": "feminine",
      "tone": "Cool German female for clear communication and audiobooks",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "e00dd3df-19e7-4cd4-827a-7ff6687b6954",
      "name": "Lukas - Professional",
      "gender": "masculine",
      "tone": "Confident male for phone systems and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "3f4ade23-6eb4-4279-ab05-6a144947c4d5",
      "name": "Karin - Companion",
      "gender": "feminine",
      "tone": "Friendly female for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "afa425cf-5489-4a09-8a3f-d3cb1f82150d",
      "name": "Nico - Friendly Agent",
      "gender": "masculine",
      "tone": "Casual male for phone calls and conversational agents",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "11c61307-4f9e-4db8-ac3b-bfa5f2a731ce",
      "name": "Serafina - Serene Storyteller",
      "gender": "feminine",
      "tone": "Deep female for calming conversations and storytelling narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "db229dfe-f5de-4be4-91fd-7b077c158578",
      "name": "Andreas - Recorder",
      "gender": "masculine",
      "tone": "Smooth male for story narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "1ade29fc-6b82-4607-9e70-361720139b12",
      "name": "Lea - Breezy Voice",
      "gender": "feminine",
      "tone": "Smooth female for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "2578354e-4b18-4d28-832c-5943344b7085",
      "name": "Klara - Empathetic Voice",
      "gender": "feminine",
      "tone": "Gentle and reassuring tone designed to offer comfort and build trust.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "c0c52199-e35f-4681-b68a-949ee499617e",
      "name": "Eleni - Troubleshooter",
      "gender": "feminine",
      "tone": "Warm, approachable Swiss-German female for technical assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "f6f315e4-4fb3-4440-92ea-2edb01f9bf1b",
      "name": "Hermann - Businessman",
      "gender": "masculine",
      "tone": "Warm, confident, and approachable voice, perfect for customer support and business conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "ac197a78-cec7-4c50-93e5-93bdc1910b11",
      "name": "Jennifer",
      "gender": "feminine",
      "tone": "Approachable adult female great for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "42f14755-88c3-4124-aae3-5cc3a9618e8f",
      "name": "Jan",
      "gender": "masculine",
      "tone": "Clear adult male great for providing guidance and instruction",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "de07efe3-b309-418b-bdca-42827223efd2",
      "name": "Rena",
      "gender": "feminine",
      "tone": "Emotive, energetic young adult female great for engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "3264ada2-4a79-4666-badc-49e2267be692",
      "name": "Christian",
      "gender": "masculine",
      "tone": "High energy adult male great for engaging and emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "43a317e9-f1b9-45bf-bbdb-1d4a52e46f0d",
      "name": "Emi",
      "gender": "feminine",
      "tone": "Calm neutral adult female great for customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "758a5cff-af0b-4bdf-84bd-4c1b5525c249",
      "name": "Leander",
      "gender": "masculine",
      "tone": "Warm and approachable voice, ideal for lifestyle content, social media, and casual explainers.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "b629d743-2b5a-4ffd-b5bb-9de9b969a690",
      "name": "Sibylle",
      "gender": "feminine",
      "tone": "Clear and confident voice, ideal for announcements and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "dff81230-ff75-49a4-af44-f6b2f43500d8",
      "name": "Jonas",
      "gender": "masculine",
      "tone": "Casual male voice thats warm, friendly, and conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "d42fc8d7-efdd-44df-bb2e-a6e093601917",
      "name": "Oskar - Steady Advisor",
      "gender": "masculine",
      "tone": "Seasoned and composed voice with a calm and confident tone, ideal for guidance and thoughtful…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "24c61c42-b538-468e-a9ad-16c7a032c9cb",
      "name": "Klaus - Archivist",
      "gender": "masculine",
      "tone": "Deep, grounded male voice for narration, storytelling, and impactful brand content.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "adc919b3-6ebf-47fd-8a46-27c5169d6d94",
      "name": "Leni - Daymaker",
      "gender": "feminine",
      "tone": "Bright, cheerful voice with clear articulation and natural enthusiasm, ideal for upbeat…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "0b66a153-548f-4f2c-b734-09a13b0bd163",
      "name": "Lorelei - Helpful Guide",
      "gender": "feminine",
      "tone": "Calm and clearly enunciated voice, ideal for informative narration, mindfulness, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "2be00b67-d53f-4eb5-89e7-96c224d56fbc",
      "name": "Dieter - Commercial Man",
      "gender": "masculine",
      "tone": "Loud and expressive adult male voice for storytelling, commercials, and energetic announcements",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "6d4b1416-8d54-4d94-a788-8a802c086544",
      "name": "Sabine - Firm Newscaster",
      "gender": "feminine",
      "tone": "Soft yet commanding adult female voice for customer support, clear communication, and giving…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "de",
      "sampleDir": "samples/cartesia-sonic-3-de"
    },
    {
      "voiceId": "50849023-76e9-46c7-af52-9ec39888a165",
      "name": "Despina - Motherly Woman",
      "gender": "feminine",
      "tone": "Warm yet authoritative middle-aged female voice, with a motherly tone for guidance, reassurance,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "el",
      "sampleDir": "samples/cartesia-sonic-3-el"
    },
    {
      "voiceId": "b45eba5b-2215-4da7-9c7c-121c95ed7b81",
      "name": "Nikos - Radio Storyteller",
      "gender": "masculine",
      "tone": "Nostalgic, middle-aged male voice with an old-radio tone for historical reenactments, vintage…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "el",
      "sampleDir": "samples/cartesia-sonic-3-el"
    },
    {
      "voiceId": "e07c00bc-4134-4eae-9ea4-1a55fb45746b",
      "name": "Brooke - Big Sister",
      "gender": "feminine",
      "tone": "Confident adult female for conversational use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4",
      "name": "Skylar - Friendly Guide",
      "gender": "feminine",
      "tone": "Approachable American female ideal for customer care and support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "62ae83ad-4f6a-430b-af41-a9bede9286ca",
      "name": "Gemma - Decisive Agent",
      "gender": "feminine",
      "tone": "Confident, emotive British female for professional assistance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f786b574-daa5-4673-aa0c-cbe3e8534c02",
      "name": "Katie - Friendly Fixer",
      "gender": "feminine",
      "tone": "Enunciating young adult female for conversational support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
      "name": "Jacqueline - Reassuring Agent",
      "gender": "feminine",
      "tone": "Confident, young adult female for empathic customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5ee9feff-1265-424a-9d7f-8e4d431a12c7",
      "name": "Ronald - Thinker",
      "gender": "masculine",
      "tone": "Intense, deep young adult male for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f9836c6e-a0bd-460e-9d3c-f7299fa60f94",
      "name": "Caroline - Southern Guide",
      "gender": "feminine",
      "tone": "Friendly, inviting, slow young adult female for conversation support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a167e0f3-df7e-4d52-a9c3-f949145efdab",
      "name": "Blake - Helpful Agent",
      "gender": "masculine",
      "tone": "Energetic adult male for engaging customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e8e5fffb-252c-436d-b842-8879b84445b6",
      "name": "Cathy - Coworker",
      "gender": "feminine",
      "tone": "Nice, young adult female for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "79f8b5fb-2cc8-479a-80df-29f7a7cf1a3e",
      "name": "Theo - Modern Narrator",
      "gender": "masculine",
      "tone": "Steady, enunciating, confident young male for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2f251ac3-89a9-4a77-a452-704b474ccd01",
      "name": "Lucy - Capable Coordinator",
      "gender": "feminine",
      "tone": "Reassuring British female for customer assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a4a16c5e-5902-4732-b9b6-2a48efd2e11b",
      "name": "Grace - Helpful Hand",
      "gender": "feminine",
      "tone": "Polished, bright Australian female for friendly professional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a33f7a4c-100f-41cf-a1fd-5822e8fc253f",
      "name": "Lauren - Lively Narrator",
      "gender": "feminine",
      "tone": "Expressive female voice for narration, storytelling, and creative content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a5136bf9-224c-4d76-b823-52bd5efcffcc",
      "name": "Jameson - Easygoing Support",
      "gender": "masculine",
      "tone": "Friendly, laid-back male voice for customer support and onboarding",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f039066f-cdb7-45ed-b51d-1034ae2f04a0",
      "name": "Cindy Baker - Receptionist",
      "gender": "feminine",
      "tone": "Smooth, welcoming adult female for frontline customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ee7ea9f8-c0c1-498c-9279-764d6b56d189",
      "name": "Oliver - Customer Chap",
      "gender": "masculine",
      "tone": "Polite, young adult male for customer facing use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "86e30c1d-714b-4074-a1f2-1cb6b552fb49",
      "name": "Carson - Curious Conversationalist",
      "gender": "masculine",
      "tone": "Friendly young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4bc3cb8c-adb9-4bb8-b5d5-cbbef950b991",
      "name": "George - Composed Consultant",
      "gender": "masculine",
      "tone": "Steady, British male voice for capable assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "87286a8d-7ea7-4235-a41a-dd9fa6630feb",
      "name": "Henry - Plainspoken Guy",
      "gender": "masculine",
      "tone": "A relaxed, youthful male voice with a monotone, matter-of-fact attitude - ideal for casual,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4f7f1324-1853-48a6-b294-4e78e8036a83",
      "name": "Casper - Gentle Narrator",
      "gender": "masculine",
      "tone": "Wistful, young male for emotional narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c8f7835e-28a3-4f0c-80d7-c1302ac62aae",
      "name": "Alistair - Composed Consultant",
      "gender": "masculine",
      "tone": "Sophisticated, steady British male for customer interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "dc30854e-e398-4579-9dc8-16f6cb2c19b9",
      "name": "Victoria - Refined Coordinator",
      "gender": "feminine",
      "tone": "Crisp, professional British female for reassuring communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0ad65e7f-006c-47cf-bd31-52279d487913",
      "name": "Rupert - Caring Dad",
      "gender": "masculine",
      "tone": "Warm, mature voice for caring, reassuring conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "47c38ca4-5f35-497b-b1a3-415245fb35e1",
      "name": "Daniel - Modern Assistant",
      "gender": "masculine",
      "tone": "Clear, crisp male voice for digital assistants and system interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "49743b08-0f5d-4741-839c-b12933853780",
      "name": "Cooper - Friendly Mate",
      "gender": "masculine",
      "tone": "Warm and highly relatable, excellent for customer service.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "10bd4af4-825b-49b8-b8bd-0ca11865536e",
      "name": "Rachel - Polished Presence",
      "gender": "feminine",
      "tone": "Refined and smooth articulation for high-quality corporate messaging.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d7bf7d75-64b7-4c1e-86c0-79d647366587",
      "name": "Michelle - Empathetic Voice",
      "gender": "feminine",
      "tone": "Gentle and reassuring tone designed to offer comfort and build trust.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7d444628-dd13-442b-b687-71a6baf0c07e",
      "name": "Joseph - Empathetic Voice",
      "gender": "masculine",
      "tone": "Gentle and reassuring tone designed to offer comfort and build trust.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "25d7abcb-4d6d-4aca-adce-8a1c85620c8b",
      "name": "Jessica - Clear Communicator",
      "gender": "feminine",
      "tone": "Crisp and articulate delivery designed for seamless information sharing.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3e39e9a5-585c-4f5f-bac6-5e4905c51095",
      "name": "Cole - Clear Communicator",
      "gender": "masculine",
      "tone": "Articulate, approachable male designed for friendly communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "263b9cc0-0d99-44e7-ae92-3d4ad5d2ad18",
      "name": "Zanele - Vibrant Advocate",
      "gender": "feminine",
      "tone": "Lively, positive delivery that brings authentic energy.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d1d9c946-7cfc-4378-85a4-07d09827cb7e",
      "name": "Jolene - Warm Storyteller",
      "gender": "feminine",
      "tone": "Rich, honeyed Southern female perfect for narration.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "baf84392-fa95-4d44-8871-d32ee36b0e01",
      "name": "Pieter - Polished Analyst",
      "gender": "masculine",
      "tone": "Clear, articulate South African male ideal for business briefings.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0ee8beaa-db49-4024-940d-c7ea09b590b3",
      "name": "Morgan - Executive Expert",
      "gender": "feminine",
      "tone": "Polished American female for highly professional interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "692846ad-1a6b-49b8-bfc5-86421fd41a19",
      "name": "Thandi - Direct Dispatcher",
      "gender": "feminine",
      "tone": "Professional South African female for structured support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d79d2b77-9192-4e10-9407-5d43ca034803",
      "name": "Siobhan - Warm Welcomer",
      "gender": "feminine",
      "tone": "Approachable Irish female for friendly, everyday dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e5d4c33a-d8f6-46e8-a10f-b5afecc35648",
      "name": "Evie - Engaging Expert",
      "gender": "feminine",
      "tone": "Formal British female for high-level corporate interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1ec736fa-db96-4eea-9299-235ce2cb7a0e",
      "name": "Conor - Decisive Agent",
      "gender": "masculine",
      "tone": "Decisive Irish male for straightforward customer communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3c0f09d6-e0d7-499c-a594-70c5b7b93048",
      "name": "Benedict - Measured Mediator",
      "gender": "masculine",
      "tone": "Polished, and formal British male.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "df89f42f-f285-4613-adbf-14eedcec4c9e",
      "name": "Harrison - Diligent Detailer",
      "gender": "masculine",
      "tone": "Crisp, professional British male for efficient customer interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3d5ce2fb-e56c-42f0-9ed9-4662484063b4",
      "name": "Toby - Genuine Guide",
      "gender": "masculine",
      "tone": "Warm, conversational British male with a polished tone.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6ccbfb76-1fc6-48f7-b71d-91ac6298247b",
      "name": "Tessa - Kind Companion",
      "gender": "feminine",
      "tone": "Friendly female voice with a warm, conversational tone that feels like chatting with a close friend",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "228fca29-3a0a-435c-8728-5cb483251068",
      "name": "Kiefer - Assured Tone",
      "gender": "masculine",
      "tone": "Confident voice with strong clarity and composed delivery, ideal for presentations and customer…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "829ccd10-f8b3-43cd-b8a0-4aeaa81f3b30",
      "name": "Linda - Conversational Guide",
      "gender": "feminine",
      "tone": "Clear, confident mature female for conversational use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5cad89c9-d88a-4832-89fb-55f2f16d13d3",
      "name": "Brandon - Confident Guy",
      "gender": "masculine",
      "tone": "Confident voice with strong clarity and composed tone, perfect for persuasive and professional…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ec1e269e-9ca0-402f-8a18-58e0e022355a",
      "name": "Ariana - Kind Friend",
      "gender": "feminine",
      "tone": "Friendly and approachable female voice with a warm, welcoming tone that builds instant connection",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "66c6b81c-ddb7-4892-bdd5-19b5a7be38e7",
      "name": "Dorothy -  Easy Charm",
      "gender": "feminine",
      "tone": "Casual female voice with a relaxed and natural tone, perfect for everyday conversations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a7b8d8fa-f6e5-4908-900e-0c11d1d82519",
      "name": "Joanie - Vibrant Speaker",
      "gender": "feminine",
      "tone": "Upbeat matured female voice with lively warmth and confidence, perfect for natural and engaging…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "999df508-4de5-40a7-8bd3-8c12f678c284",
      "name": "Layla - Casual Friend",
      "gender": "feminine",
      "tone": "Chill voice with a smooth, easygoing tone that feels relaxed and effortlessly cool",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "26403c37-80c1-4a1a-8692-540551ca2ae5",
      "name": "Marian - Poised Narrator",
      "gender": "feminine",
      "tone": "Matured female voice with calm authority and smooth pacing, perfect for narrations and storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "41468051-3a85-4b68-92ad-64add250d369",
      "name": "Cory - Relaxed Voice",
      "gender": "masculine",
      "tone": "Casual male voice with a friendly, easygoing tone that feels natural and approachable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c961b81c-a935-4c17-bfb3-ba2239de8c2f",
      "name": "Kyle - Approachable Friend",
      "gender": "masculine",
      "tone": "Friendly male voice with a warm, conversational tone that builds instant connection and trust",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "694f9389-aac1-45b6-b726-9d9369183238",
      "name": "Sarah - Mindful Woman",
      "gender": "feminine",
      "tone": "Soothing female for meditations and calming conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d",
      "name": "Elizabeth - Manager",
      "gender": "feminine",
      "tone": "Enunicating young female for providing guidance and instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "bf0a246a-8642-498a-9950-80c35e9276b5",
      "name": "Sophie - Teacher",
      "gender": "feminine",
      "tone": "Mature female for natural conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "57dcab65-68ac-45a6-8480-6c4c52ec1cd1",
      "name": "Kira - Trusted Confidant",
      "gender": "feminine",
      "tone": "Emotive, young adult female for empathetic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "78ab82d5-25be-4f7d-82b3-7ad64e5b85b2",
      "name": "Savannah - Magnolia Belle",
      "gender": "feminine",
      "tone": "Adult female for casual, authentic conservations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "03496517-369a-4db1-8236-3d3ae459ddf7",
      "name": "Calypso - ASMR Lady",
      "gender": "feminine",
      "tone": "Soothing female for meditations and other calming use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b7d50908-b17c-442d-ad8d-810c63997ed9",
      "name": "Sierra - California Girl",
      "gender": "feminine",
      "tone": "Slow, chill young adult female for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "32b3f3c5-7171-46aa-abe7-b598964aa793",
      "name": "Daisy - Reading Girl",
      "gender": "feminine",
      "tone": "Very young female for children's book narrations and young animated personas",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "00a77add-48d5-4ef6-8157-71e5437b282d",
      "name": "Callie - Encourager",
      "gender": "feminine",
      "tone": "Smooth, young adult female for empathetic conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4af7c703-f2a9-45dd-a7fd-724cf7efc371",
      "name": "Lila - Meditation Guide",
      "gender": "feminine",
      "tone": "Melodic female for gentle and empathetic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "156fb8d2-335b-4950-9cb3-a2d33befec77",
      "name": "Sunny - Pep Talker",
      "gender": "feminine",
      "tone": "Upbeat female for engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8d8ce8c9-44a4-46c4-b10f-9a927b99a853",
      "name": "Connie - Candid Conversationalist",
      "gender": "feminine",
      "tone": "Natural, cheery young adult female for authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c2ac25f9-ecc4-4f56-9095-651354df60c0",
      "name": "Renee - Commander",
      "gender": "feminine",
      "tone": "Firm adult female fit for broadcasts and narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5c42302c-194b-4d0c-ba1a-8cb485c84ab9",
      "name": "Mary - Nurse",
      "gender": "feminine",
      "tone": "Mature adult female for instructional videos and empathetic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "146485fd-8736-41c7-88a8-7cdd0da34d84",
      "name": "Tim - Pal",
      "gender": "masculine",
      "tone": "Nasal-y male for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3b554273-4299-48b9-9aaf-eefd438e3941",
      "name": "Simi - Support Specialist",
      "gender": "feminine",
      "tone": "Firm, young accented female for customer support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "71a7ad14-091c-4e8e-a314-022ece01c121",
      "name": "Charlotte - Heiress",
      "gender": "feminine",
      "tone": "Elegant, young adult female for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "565510e8-6b45-45de-8758-13588fbaec73",
      "name": "Ray - Conversationalist",
      "gender": "masculine",
      "tone": "Approachable male voice with a laid-back, natural delivery for everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e3827ec5-697a-4b7c-9704-1a23041bbc51",
      "name": "Dottie - Sweet Gal",
      "gender": "feminine",
      "tone": "High pitched, earnest, very young female for character narrations for children",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "98a34ef2-2140-4c28-9c71-663dc4dd7022",
      "name": "Clyde - Calm Narrator",
      "gender": "masculine",
      "tone": "Gentle, measured male voice with warmth and clarity for storytelling and informative reads",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8f091740-3df1-4795-8bd9-dc62d88e5131",
      "name": "Aurora - Fairy Princess",
      "gender": "feminine",
      "tone": "Fairy like female for character use cases in entertainment",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1463a4e1-56a1-4b41-b257-728d56e93605",
      "name": "Hugo - Teatime Friend",
      "gender": "masculine",
      "tone": "Expressive, young adult male for characters and natural conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ed81fd13-2016-4a49-8fe3-c0d2761695fc",
      "name": "Zack - Sportsman",
      "gender": "masculine",
      "tone": "Firm, energetic male for lively announcing",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "34575e71-908f-4ab6-ab54-b08c95d6597d",
      "name": "Joey - Neighborhood Guy",
      "gender": "masculine",
      "tone": "Casual, friendly male for natural conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "00967b2f-88a6-4a31-8153-110a92134b9f",
      "name": "Asher - Podcaster",
      "gender": "masculine",
      "tone": "Firm adult male for audiobooks and clear communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5abd2130-146a-41b1-bcdb-974ea8e19f56",
      "name": "Jo - Go to Gal",
      "gender": "feminine",
      "tone": "Young adult female for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "91b4cf29-5166-44eb-8054-30d40ecc8081",
      "name": "Tina - Customer Ally",
      "gender": "feminine",
      "tone": "Natural, firm adult female for authentic conversation and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "729651dc-c6c3-4ee5-97fa-350da1f88600",
      "name": "Jake - Sidekick",
      "gender": "masculine",
      "tone": "Friendly, young adult male for welcoming and engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f6ff7c0c-e396-40a9-a70b-f7607edb6937",
      "name": "Emma - Customer Care Line",
      "gender": "feminine",
      "tone": "Casual adult female for natural conversations and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "11af83e2-23eb-452f-956e-7fee218ccb5c",
      "name": "Ruth - Manager",
      "gender": "feminine",
      "tone": "Firm, authoritative female for providing guidance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "820a3788-2b37-4d21-847a-b65d8a68c99a",
      "name": "Tyler - Friendly Salesman",
      "gender": "masculine",
      "tone": "Direct and confidence inspiring adult male for sales and friendly interpersonal conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a0e99841-438c-4a64-b679-ae501e7d6091",
      "name": "Greg - Supporter",
      "gender": "masculine",
      "tone": "Neutral, deep male for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c99d36f3-5ffd-4253-803a-535c1bc9c306",
      "name": "Griffin - Narrator",
      "gender": "masculine",
      "tone": "Elderly male for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e13cae5c-ec59-4f71-b0a6-266df3c9bb8e",
      "name": "Lulu - Madame Mischief",
      "gender": "feminine",
      "tone": "Squeaky, young female for media and entertainment for kids",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9fa83ce3-c3a8-4523-accc-173904582ced",
      "name": "Keith - Easygoing Friend",
      "gender": "masculine",
      "tone": "Chill, young adult male for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d46abd1d-2d02-43e8-819f-51fb652c1c61",
      "name": "Grant - Friendly Support",
      "gender": "masculine",
      "tone": "Reliable, clear male voice with neutral American accent for customer support interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6adbb439-0865-468c-9e68-adbb0eb2e71c",
      "name": "Sally - Soft Spoken Guide",
      "gender": "feminine",
      "tone": "Gentle female for calm conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a01c369f-6d2d-4185-bc20-b32c225eab70",
      "name": "Fiona - Witty Woman",
      "gender": "feminine",
      "tone": "Chirpy and energetic British female voice with a bright tone, great for lively and engaging…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7ea5e9c2-b719-4dc3-b870-5ba5f14d31d8",
      "name": "Janvi - Steady Agent",
      "gender": "feminine",
      "tone": "Calm and neutral female voice with a slow, steady delivery, ideal for customer support scenarios",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "638efaaa-4d0c-442e-b701-3fae16aad012",
      "name": "Sameer - Problem Solver",
      "gender": "masculine",
      "tone": "Friendly male for customer support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f8f5f1b2-f02d-4d8e-a40d-fd850a487b3d",
      "name": "Kiara - Joyful Woman",
      "gender": "feminine",
      "tone": "Upbeat, enunciating Indian accented mature adult female for happy conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d7e54830-4754-4b17-952c-bcdb7e80a2fb",
      "name": "Mabel - Grandma",
      "gender": "feminine",
      "tone": "Friendly, grandmotherly female for empathetic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e00d0e4c-a5c8-443f-a8a3-473eb9a62355",
      "name": "Zeke - Friendly Sidekick",
      "gender": "masculine",
      "tone": "High pitched, friendly, young adult male for gaming and entertainment characters",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "42b39f37-515f-4eee-8546-73e841679c1d",
      "name": "James - Navigator",
      "gender": "masculine",
      "tone": "Very deep, authoritative male for providing guidance and instruction",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a38e4e85-e815-43ab-acf1-907c4688dd6c",
      "name": "Lindsey - Relaxed Rep",
      "gender": "feminine",
      "tone": "Happy adult female with a laidback affect for casual conversations and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "41534e16-2966-4c6b-9670-111411def906",
      "name": "Clarence - Newsman",
      "gender": "masculine",
      "tone": "Firm, deep male with old time radio like acoustics for 20th century historical reenactments",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f31cc6a7-c1e8-4764-980c-60a361443dd1",
      "name": "Olivia - Sunny Woman",
      "gender": "feminine",
      "tone": "Friendly, happy adult female for engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "21b81c14-f85b-436d-aff5-43f2e788ecf8",
      "name": "Riley - Chill Friend",
      "gender": "feminine",
      "tone": "Casual, young female for authentic and everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1259b7e3-cb8a-43df-9446-30971a46b8b0",
      "name": "Devansh - Warm Support Agent",
      "gender": "masculine",
      "tone": "Warm, conversational Indian male adult voice for casual chats, everyday interactions, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4df027cb-2920-4a1f-8c34-f21529d5c3fe",
      "name": "Carson - Friendly Support",
      "gender": "masculine",
      "tone": "Friendly, young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1fc31370-81b1-4588-9c1a-f93793c6e01d",
      "name": "Carlo - Roman Guide",
      "gender": "masculine",
      "tone": "Inviting, young accented male for tourism use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "87bc56aa-ab01-4baa-9071-77d497064686",
      "name": "Jordan - Chill Pal",
      "gender": "masculine",
      "tone": "Welcoming adult male for engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f6141af3-5f94-418c-80ed-a45d450e7e2e",
      "name": "Priya - Trusted Operator",
      "gender": "feminine",
      "tone": "Authoritative, adult female for customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8985388c-1332-4ce7-8d55-789628aa3df4",
      "name": "Robyn - Storycrafter",
      "gender": "feminine",
      "tone": "Neutral, mature female for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "043cfc81-d69f-4bee-ae1e-7862cb358650",
      "name": "Amelia - Instructor",
      "gender": "feminine",
      "tone": "Strong, composed female voice suited for giving instructions with clarity and authority",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1d3ba41a-96e6-44ad-aabb-9817c56caa68",
      "name": "Mia - Agent",
      "gender": "feminine",
      "tone": "Firm, young female for customer support and casual, natural conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c8605446-247c-4d39-acd4-8f4c28aa363c",
      "name": "Edith - Matriarch",
      "gender": "feminine",
      "tone": "Elderly, confident female for narrations and wise characters",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f114a467-c40a-4db8-964d-aaba89cd08fa",
      "name": "Miles - Yogi",
      "gender": "masculine",
      "tone": "Deep, soothing mature male for providing guidance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "607167f6-9bf2-473c-accc-ac7b3b66b30b",
      "name": "Brenda - Host",
      "gender": "feminine",
      "tone": "Cheerful, friendly female voice that creates a positive, helpful experience for customer…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "cccc21e8-5bcf-4ff0-bc7f-be4e40afc544",
      "name": "Avery - Gaming Girl",
      "gender": "feminine",
      "tone": "High pitched, energetic young female for animated characters and gaming and entertainment use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "55deba52-bc73-4481-ab69-9c8831c8a7c3",
      "name": "Camille - Friendly Expert",
      "gender": "feminine",
      "tone": "Calm, neutral female for customer support and instructional videos",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "bd9120b6-7761-47a6-a446-77ca49132781",
      "name": "Owen - Tutorial Man",
      "gender": "masculine",
      "tone": "Elevated, mature adult male for providing guidance and instruction",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "701a96e1-7fdd-4a6c-a81e-a4a450403599",
      "name": "Rowan - Team Leader",
      "gender": "masculine",
      "tone": "Confident male for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3e1ed423-17e5-4773-b87c-25b031106e41",
      "name": "Paul - Straight Talker",
      "gender": "masculine",
      "tone": "Deep and firm male voice with a relaxed, conversational delivery",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1242fb95-7ddd-44ac-8a05-9e8a22a6137d",
      "name": "Cindy - Receptionist",
      "gender": "feminine",
      "tone": "Smooth, welcoming adult female for frontline customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "996a8b96-4804-46f0-8e05-3fd4ef1a87cd",
      "name": "Darla - Resolution Agent",
      "gender": "feminine",
      "tone": "Firm and confident female voice with a calm, supportive tone - ideal for customer support roles",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "da4a4eff-3b7e-4846-8f70-f075ff61222c",
      "name": "Callum - Brand Spokesperson",
      "gender": "masculine",
      "tone": "Neutral, confident young adult male fit for voiceovers and customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "fb26447f-308b-471e-8b00-8e9f04284eb5",
      "name": "Thistle - Troublemaker",
      "gender": "neutral",
      "tone": "Cheery, expressive gender neutral character for whimsical personas in entertainment content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "bf991597-6c13-47e4-8411-91ec2de5c466",
      "name": "Carol - Task Coach",
      "gender": "feminine",
      "tone": "Authortative, mature female for giving instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "23e9e50a-4ea2-447b-b589-df90dbb848a2",
      "name": "Dallas - Fireside Friend",
      "gender": "masculine",
      "tone": "Kind male for inviting and authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "97f4b8fb-f2fe-444b-bb9a-c109783a857a",
      "name": "Nathan - Easy Talker",
      "gender": "masculine",
      "tone": "Confident, firm young adult male with a slight edge for conversational use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "daf747c6-6bc2-4083-bd59-aa94dce23f5d",
      "name": "Yasmin - Dialogue Anchor",
      "gender": "feminine",
      "tone": "Firm adult female for conversational use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7cf0e2b1-8daf-4fe4-89ad-f6039398f359",
      "name": "Benedict - Royal Narrator",
      "gender": "masculine",
      "tone": "Confident, firm male for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "87748186-23bb-4158-a1eb-332911b0b708",
      "name": "Alaric - Wizard",
      "gender": "masculine",
      "tone": "Wistful, wise, elderly male for entertainment and fun characters",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c9440d34-5641-427b-bbb7-80ef7462576d",
      "name": "Joan - Messenger",
      "gender": "feminine",
      "tone": "Young adult female for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5c9e800f-2a92-4720-969b-99c4ab8fbc87",
      "name": "Ellen - Welcome Agent",
      "gender": "feminine",
      "tone": "Authentic female voice with balanced warmth and clarity for both casual and support-driven contexts",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "13524ffb-a918-499a-ae97-c98c7c4408c4",
      "name": "Barry - Helper",
      "gender": "masculine",
      "tone": "Inviting, friendly male for customer support and product videos",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7e19344f-9f17-47d7-a13a-4366ad06ebf3",
      "name": "Silas - Nighttime Narrator",
      "gender": "masculine",
      "tone": "Gentle and steady male voice with a nurturing tone for calm conversations and serene narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3246e36c-ac8c-418d-83cd-4eaad5a3b887",
      "name": "Carson - Sad Friendly Support",
      "gender": "masculine",
      "tone": "Friendly young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6d287143-8db3-434a-959c-df147192da27",
      "name": "Stacy - Mentor",
      "gender": "feminine",
      "tone": "Mature-sounding female voice with kindness and ease, perfect for natural interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2a4d065a-ac91-4203-a015-eb3fc3ee3365",
      "name": "Wes - Customer Companion",
      "gender": "masculine",
      "tone": "Kind male for engaging with customers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "40104aff-a015-4da1-9912-af950fbec99e",
      "name": "Travis - How To Guide",
      "gender": "masculine",
      "tone": "Firm, young male for instructional videos and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "56b87df1-594d-4135-992c-1112bb504c59",
      "name": "Lexi - Fun Friend",
      "gender": "feminine",
      "tone": "Cheery, young female for entertainment, media, and gaming use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "50d6beb4-80ea-4802-8387-6c948fe84208",
      "name": "Alfred - Cheeky Person",
      "gender": "masculine",
      "tone": "Playful, elderly male for media and entertainment",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0c8ed86e-6c64-40f0-b252-b773911de6bb",
      "name": "Doris - Friend",
      "gender": "feminine",
      "tone": "Warm and relatable female voice suited for casual, natural conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "63ff761f-c1e8-414b-b969-d1833d1c870c",
      "name": "Malcom - Talk Show Host",
      "gender": "masculine",
      "tone": "Lively and experienced male voice ideal for natural, engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ab109683-f31f-40d7-b264-9ec3e26fb85e",
      "name": "Russell - Mentor",
      "gender": "masculine",
      "tone": "Friendly, deep mature adult male for providing instructions and guidance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "41f3c367-e0a8-4a85-89e0-c27bae9c9b6d",
      "name": "Liam - Guy Next Door",
      "gender": "masculine",
      "tone": "Casual, friendly young male for authentic and engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "573e3144-a684-4e72-ac2b-9b2063a50b53",
      "name": "Sylvia - Librarian",
      "gender": "feminine",
      "tone": "Firm female for instructions and guidance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c45bc5ec-dc68-4feb-8829-6e6b2748095d",
      "name": "Trevor - Movieman",
      "gender": "masculine",
      "tone": "Deep, elderly male for narrations and entertainment use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7fe6faca-172f-4fd9-a193-25642b8fdb07",
      "name": "Victor - Voiceover Man",
      "gender": "masculine",
      "tone": "Versatile, engaging adult male for professional use cases, narrations, and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ec58877e-44ae-4581-9078-a04225d42bd4",
      "name": "Charles - Heroic Man",
      "gender": "masculine",
      "tone": "Very deep, adult male for characters that embody strength and determination",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3dcaa773-fb1a-47f7-82a4-1bf756c4e1fb",
      "name": "Harry - Service Advisor",
      "gender": "masculine",
      "tone": "Seasoned male for friendly conversation and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "726d5ae5-055f-4c3d-8355-d9677de68937",
      "name": "Troy - Fix It Man",
      "gender": "masculine",
      "tone": "Strong, dependable male voice designed for trust-building in customer-facing interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "96c64eb5-a945-448f-9710-980abe7a514c",
      "name": "Carson - Friendly Support",
      "gender": "masculine",
      "tone": "Friendly, young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "15a9cd88-84b0-4a8b-95f2-5d583b54c72e",
      "name": "Claire - Storyteller",
      "gender": "feminine",
      "tone": "Soothing, neutral female for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "39b376fc-488e-4d0c-8b37-e00b72059fdd",
      "name": "Sheldon - Help Desk Man",
      "gender": "masculine",
      "tone": "Enunciating male for customer support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f4e8781b-a420-4080-81cf-576331238efa",
      "name": "Samantha - Support Leader",
      "gender": "feminine",
      "tone": "Firm, confident adult female for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a8136a0c-9642-497a-882d-8d591bdcb2fa",
      "name": "Diane - Service Assistant",
      "gender": "feminine",
      "tone": "Firm, mature adult female for customer support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "57b6bf63-c7a1-4ffc-8e10-23bf45152dd6",
      "name": "Rebecca - Counselor",
      "gender": "feminine",
      "tone": "Soft-spoken, empathetic female voice suited for thoughtful, calming dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7360f116-6306-4e9a-b487-1235f35a0f21",
      "name": "Marty - Commercial King",
      "gender": "masculine",
      "tone": "Bold and enthusiastic male voice suited for energetic, attention-grabbing ads",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "bbee10a8-4f08-4c5c-8282-e69299115055",
      "name": "Ben - Helpful Man",
      "gender": "masculine",
      "tone": "slightly raspy voiced middle aged man for friendly and natural conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5e10a334-7fa5-46d4-a64b-5ae6185da3fd",
      "name": "Samantha - Sad Support Leader",
      "gender": "feminine",
      "tone": "Firm, confident adult female for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0b32066b-2bcc-44b9-89ab-0223a09d1606",
      "name": "Carson - Angry Friendly Support",
      "gender": "masculine",
      "tone": "Friendly young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "761afc95-bef5-44dd-aa07-d3c678912e43",
      "name": "Samantha - Happy Support Leader",
      "gender": "feminine",
      "tone": "Firm, confident adult female for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f9fc912e-52f0-448a-8bfa-47e9ca75f25a",
      "name": "Marilyn - Explainer",
      "gender": "feminine",
      "tone": "smooth and supportive young adult woman great for natural conversations and explaining",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "bfd3644b-d561-4b1c-a01f-d9af98cb67c0",
      "name": "Matt - Goofy Friend",
      "gender": "masculine",
      "tone": "High pitched, silly male for fun characters and entertainment use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2747b6cf-fa34-460c-97db-267566918881",
      "name": "Allie - Natural Conversationalist",
      "gender": "feminine",
      "tone": "Confident, approachable young adult woman for natural conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8d110413-2f14-44a2-8203-2104db4340e9",
      "name": "Darren - Friendly Barritone",
      "gender": "masculine",
      "tone": "Deep, friendly adult male for happy voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "af346552-54bf-4c2b-a4d4-9d2820f51b6c",
      "name": "Valerie - Support Authority",
      "gender": "feminine",
      "tone": "Authoritative mature female for frontline customer support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5619d38c-cf51-4d8e-9575-48f61a280413",
      "name": "Mark - Promotion Lead",
      "gender": "masculine",
      "tone": "Deep, confident male voice with strong presence - ideal for commercials, promos, and broadcast…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "34d923aa-c3b5-4f21-aac7-2c1f12730d4b",
      "name": "Griffin - Excited Narrator",
      "gender": "masculine",
      "tone": "Elderly male for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "64462aed-aafc-45d4-84cd-ecb4b3763a0a",
      "name": "Shawn - Ad Reader",
      "gender": "masculine",
      "tone": "Upbeat male for commercials, announcements, and promotions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5c43e078-5ba4-4e1f-9639-8d85a403f76a",
      "name": "Carson - Scared Friendly Support",
      "gender": "masculine",
      "tone": "Friendly young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "36b42fcb-60c5-4bec-b077-cb1a00a92ec6",
      "name": "Gordon - Pilot",
      "gender": "masculine",
      "tone": "Male, simulating the acoustics over an intercom, for entertainment use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d7862948-75c3-4c7c-ae28-2959fe166f49",
      "name": "Caspian - Oracle",
      "gender": "masculine",
      "tone": "Echo-y, mystical male for characters with gravitas",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6a176356-ada1-4b48-b2ae-3a3fdd485680",
      "name": "Elias - Night Warden",
      "gender": "masculine",
      "tone": "Deep male for entertainment and gaming characters",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "586b6832-1ca1-43ad-b974-527dc13c2532",
      "name": "Dorian - Director",
      "gender": "masculine",
      "tone": "Welcoming male for providing instructions and guidance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "66f5935b-af2e-4ec9-bb3e-59112e9ddc93",
      "name": "Carson - Surprised Friendly Support",
      "gender": "masculine",
      "tone": "Friendly young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "236bb1fb-dc41-4a2b-84d6-d22d2a2aaae1",
      "name": "Franklin - Old Time Radio Host",
      "gender": "masculine",
      "tone": "Elderly man speaking over a crackling 20th century radio for historical reenactments",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ee8b13e7-98af-4b15-89d1-8d402be10c94",
      "name": "Carson - Disgusted Friendly Support",
      "gender": "masculine",
      "tone": "Friendly young adult male for customer support conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d3e03deb-5439-4203-add1-ca9a7501eaa7",
      "name": "Samantha - Yelling Support Leader",
      "gender": "feminine",
      "tone": "Firm, confident adult female for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "04bfd756-4fd4-42c2-9ccf-37f647c5bf54",
      "name": "Samantha - Angry Support Leader",
      "gender": "feminine",
      "tone": "Firm, confident adult female for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "efddb3d2-4464-45e0-9f8a-fcd5fd4fc54f",
      "name": "Nadia - Singaporean Female",
      "gender": "feminine",
      "tone": "Friendly and clear Singaporean female voice.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b60048c2-abb5-43fa-b403-90dce232e55e",
      "name": "Amanda - Warm Guide",
      "gender": "feminine",
      "tone": "Inviting and approachable tone perfect for providing friendly guidance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6a73e45f-3fa6-427c-97da-0fc6a7a1bc0d",
      "name": "Stephanie - Steady Professional",
      "gender": "feminine",
      "tone": "Steady and even pacing that offers a grounding presence for any script.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8d2c9eda-31df-477a-9eb6-df6f00b82845",
      "name": "Ellie Mae - Friendly Companion",
      "gender": "feminine",
      "tone": "Bright, approachable Southern female that feels like a trusted neighbor.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "072d954b-8379-4b6b-816a-bb0cd38725f8",
      "name": "Anele - Bright Presenter",
      "gender": "feminine",
      "tone": "Clear South African female for customer service.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5f621418-ab01-4bf4-9a9d-73d66032234e",
      "name": "Willow - Approachable Ally",
      "gender": "feminine",
      "tone": "Friendly female for approachable, down-to-earth support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c5d00dfb-501f-43f3-8e79-c810d24f5acd",
      "name": "Harper - Conversationalist",
      "gender": "feminine",
      "tone": "Adult female for highly structured communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ed9ccfa4-8fa1-40f8-bfb2-cb7d67d2f9cd",
      "name": "Ruby - Helpful Handler",
      "gender": "feminine",
      "tone": "Adult female for everyday dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5fc5c797-12c5-4f2b-ac9b-d4e53c08098f",
      "name": "Wyatt - Dependable Dispatcher",
      "gender": "masculine",
      "tone": "Friendly, clear American male with a subtle Southern drawl.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7d7d769c-5ab1-4dd5-bb17-ec8d4b69d03d",
      "name": "Eleanor - Composed Clarifier",
      "gender": "feminine",
      "tone": "Clear, professional adult female for customer communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "fd098a10-ba9e-445e-b144-be2a9f3dac02",
      "name": "David - Angry Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "fb78f09f-f998-4061-ad51-d71f90388f0e",
      "name": "Lori - Scared Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f96dc0b1-7900-4894-a339-81fb46d515a7",
      "name": "Steve - Disgusted Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f80e7298-93f5-46d0-86f2-b8f29cfc88bd",
      "name": "Claudia - Welcoming Lady",
      "gender": "feminine",
      "tone": "Friendly, calm young adult female for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c4e848dc-d4fd-4bc8-90ea-8525563ec0e5",
      "name": "David - Sad Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c2da2a3e-b0d6-46bf-a09a-68562617a50a",
      "name": "Lori - Surprised Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c1c65fc2-528a-4dde-a2c4-f822785c2704",
      "name": "Steve - Curious Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ba0add52-783c-4ec0-8b9c-7a6b60f99d1c",
      "name": "Lori - Curious Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b1ce5126-4d08-42c3-adef-d3eb39e90c7a",
      "name": "Steve - Scared Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b08c966e-2146-4592-99eb-3171a714a43c",
      "name": "David - Curious Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "adde00e9-c98f-42ae-a94d-fc9f92f11c76",
      "name": "Steve - Happy Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a5def41e-2e73-433f-92f7-5f1d99fef05d",
      "name": "Madison - Surprised Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic, young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a3a4fe2a-d402-41d1-be7d-28f71eda755f",
      "name": "David - Scared Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9d2b4a7f-7ced-4fb8-b570-9ce21fb931c8",
      "name": "David - Disgusted Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "98c87826-dba2-44f4-b123-4c7e3c8a2647",
      "name": "Madison - Curious Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic, young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "911b8b22-887f-4caf-bf87-85d834c08708",
      "name": "Kenneth - Friendly Rep",
      "gender": "masculine",
      "tone": "Well-paced male voice with clear enunciation, great for approachable and informative conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8e14933d-ecd7-402b-9505-795130d69b35",
      "name": "Luke - Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8843adfb-77d3-455a-86f9-de0651555ec6",
      "name": "Lori - Happy Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "80713a53-e484-4f69-9852-7891096016ac",
      "name": "Steve - Sad Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7c8ba972-4960-4c43-bea0-8178e2205696",
      "name": "Steve - Angry Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "79b8126f-c5d9-4a73-8585-ba5e1a077ed6",
      "name": "Luke - Disgusted Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "725d43d6-1196-480e-bd87-728ae5eff9e1",
      "name": "Luke - Surprised Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6fd4f468-0345-4f41-81d0-3f48ebc295e0",
      "name": "Steve - Surprised Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6b622a1d-906f-44af-b60c-7bef365bf124",
      "name": "David - Happy Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "63426c82-a0c9-4f23-a175-50eb64c95ec1",
      "name": "Luke - Scared Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "62305e79-9d39-4643-b003-5e0b096fe4f4",
      "name": "Madison - Happy Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "61001bc6-9064-40a4-b8b2-29178e0fa558",
      "name": "Luke - Angry Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5cc54223-ec0c-4c50-87e9-b9947264e1f4",
      "name": "Lori - Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5c7b66c2-3b58-464d-8a12-093410a269c5",
      "name": "Luke - Sad Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5993c2c9-5d59-403e-b459-946c8b302086",
      "name": "Madison - Disgusted Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "414da90b-16b3-4e88-86f5-3c3945e8fa4b",
      "name": "Lori - Disgusted Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3d79b1fd-daaa-439c-bff3-903dc18e7684",
      "name": "Luke - Happy Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "30236d07-62d0-4c63-abf7-df46aa45e473",
      "name": "Madison - Scared Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic, young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2d01710c-7c77-4cf1-b0d0-5902a25f6e17",
      "name": "Lori - Sad Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "27c12970-3efb-4f39-a78a-2fbb7bddc941",
      "name": "Madison - Sad Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "134838f5-ce7e-4876-ac32-6367b99daf83",
      "name": "Madison - Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic, young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "10d17ae0-8f64-472a-be00-f00a98c729e0",
      "name": "David - Surprised Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "02fe5732-a072-4767-83e3-a91d41d274ca",
      "name": "Madison - Best Friend",
      "gender": "feminine",
      "tone": "Enthusiastic, young adult female for emotive discussions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9fb269e7-70fe-4cbe-aa3f-28bdb67e3e84",
      "name": "Steve - Baritone",
      "gender": "masculine",
      "tone": "Deep, firm adult male for narrations and voiceovers",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7b2c0a2e-3dd3-4a44-b16b-26ecd8134279",
      "name": "Luke - Broadway Voice",
      "gender": "masculine",
      "tone": "Seasoned male voice for casual, authentic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "da69d796-4603-4419-8a95-293bfc5679eb",
      "name": "David - Greeter",
      "gender": "masculine",
      "tone": "Engaging adult male for advertising and upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "57c63422-d911-4666-815b-0c332e4d7d6a",
      "name": "Lori - Cheerleader",
      "gender": "feminine",
      "tone": "Female with clear enunciation for upbeat, emotive conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3faa81ae-d3d8-4ab1-9e44-e50e46d33c30",
      "name": "Jasper - Service Specialist",
      "gender": "masculine",
      "tone": "Warm, expressive voice for customer support and sales conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4703c250-66e4-4682-a223-0a60acafcfc0",
      "name": "Levi - Steady Spokesman",
      "gender": "masculine",
      "tone": "Strong, confident voice for customer service, newscasting, and reliable narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "dda51133-5d43-4a3b-84e6-e68c13f60cba",
      "name": "Lily - Casual Pal",
      "gender": "feminine",
      "tone": "Relaxed, casual voice for friendly, everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "489b647b-5662-408f-8c95-82e26ef8d29e",
      "name": "Kate - Practical Voice",
      "gender": "feminine",
      "tone": "Direct, no-nonsense female voice for instructions and clear explanations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "58fbaf73-d7de-4e82-a6b3-118180e7057c",
      "name": "Janet - Sunny Speaker",
      "gender": "feminine",
      "tone": "Bright, warm female voice for guidance, narration, and supportive interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2a17e905-8f14-4db7-9b9d-9223a8e3f278",
      "name": "Jane - Digital Guide",
      "gender": "feminine",
      "tone": "A crisp, modern voice with a friendly, intelligent tone — great for virtual-assistant tasks,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3c7dfd17-3fa8-47aa-aacc-6313fe025442",
      "name": "Evelyn - Digital Assistante",
      "gender": "feminine",
      "tone": "A clear, neutral, and precise female voice with a smooth digital polish - perfect for…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "39d518b7-fd0b-4676-9b8b-29d64ff31e12",
      "name": "Aarav - Old Time Storyteller",
      "gender": "masculine",
      "tone": "Warm adult male voice with a slight Indian accent and a vintage tone for nostalgic storytelling,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4fb26a05-57de-4d21-855a-f51adae44f38",
      "name": "Barry 2.0 - Helper",
      "gender": "masculine",
      "tone": "Inviting, friendly male for customer support and product videos",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "fbf7d2ec-ebea-49f2-8889-a482b9b0a7ed",
      "name": "Wade 2.0 - Southern Soul",
      "gender": "masculine",
      "tone": "Country-sounding male voice with a warm drawl and genuine charm, perfect for friendly storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1cb5b8bc-77c9-4e7c-a251-da02348e2727",
      "name": "Sean - Steady Companion",
      "gender": "masculine",
      "tone": "Casual voice with an easy, relaxed tone that feels natural and effortlessly approachable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f24ae0b7-a3d2-4dd1-89df-959bdc4ab179",
      "name": "Ross - Reliable Partner",
      "gender": "masculine",
      "tone": "Steady voice with balanced tone and clear delivery, ideal for customer support and service",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "db69127a-dbaf-4fa9-b425-2fe67680c348",
      "name": "Clint - Rugged Actor",
      "gender": "masculine",
      "tone": "Raspy voice with rugged tone, perfect for voice acting and dramatic narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ca566b43-944e-4474-b494-7d9f0695f307",
      "name": "Celine - Soothing Presence",
      "gender": "feminine",
      "tone": "Relaxed voice with smooth tone and gentle warmth, ideal for calm conversations and easy listening",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4d3d2e9c-14e4-4802-a8d8-bd5268a73fde",
      "name": "Judith - Poised Strength",
      "gender": "feminine",
      "tone": "Confident voice with clear articulation and composed tone, perfect for presentations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8634bd27-0acf-4056-b014-4fea0385ed9e",
      "name": "Suzanne - Laidback Aunt",
      "gender": "feminine",
      "tone": "Matured voice with a natural, conversational tone that feels warm, relatable, and approachable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5fb68a42-0ed7-46fa-8a8f-ad4b332fbf6f",
      "name": "Edward - Persuasive Promoter",
      "gender": "masculine",
      "tone": "Confident voice with clarity and persuasive tone, perfect for advertisements and promotional content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b56c6aac-f35f-46f7-9361-e8f078cec72e",
      "name": "Tabitha - Smooth Energy",
      "gender": "feminine",
      "tone": "Smooth voice with easy warmth and relaxed tone, perfect for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f0377496-2708-4cc9-b2f8-1b7fdb5e1a2a",
      "name": "Elaine - Confident Guide",
      "gender": "feminine",
      "tone": "Assured voice with calm confidence and clear tone, ideal for professional, informative, or…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b134c304-d095-4d2b-a77a-914f5e8e84e7",
      "name": "Sterling - Monarch",
      "gender": "masculine",
      "tone": "Deep voice with commanding presence and dignified tone, perfect for narrations and authoritative…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "74f42072-6245-4fe2-b5dc-3dc9b56fdbd0",
      "name": "Regis - News Anchor",
      "gender": "masculine",
      "tone": "Authoritative voice with polished clarity and balanced tone, perfect for news delivery and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "373e661a-f0ef-4e34-a09e-183184a443e6",
      "name": "Tanner - Laidback Spirit",
      "gender": "masculine",
      "tone": "Laidback voice with smooth tone and easy rhythm, great for conversational and approachable content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9301949d-b7cd-40d9-a246-5a4430992d6b",
      "name": "Marcus - Reliable Guy",
      "gender": "masculine",
      "tone": "Composed voice with approachable warmth, perfect for customer service and support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e39b9fc0-23f5-4616-962a-da99c8ccb1dc",
      "name": "Colin - Assured Guide",
      "gender": "masculine",
      "tone": "Confident voice with clear articulation and reassuring tone, ideal for professional and customer…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "01fd7d67-d2a0-4e4e-8c48-42611c71a926",
      "name": "Skyler - Laidback Partner",
      "gender": "masculine",
      "tone": "Easygoing voice with effortless tone that feels natural and approachable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "df872fcd-da17-4b01-a49f-a80d7aaee95e",
      "name": "Cameron - Chill Companion",
      "gender": "masculine",
      "tone": "Laidback voice with a natural, conversational tone that feels friendly and easy to engage with",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0a9a5903-0a30-4d2e-b6b6-891f73d4b4e0",
      "name": "Sabrina - Casual Ally",
      "gender": "feminine",
      "tone": "Relaxed female voice with an easy, conversational tone that feels approachable and genuine",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f6ce3444-478b-4ce4-982e-bcb72dffe7aa",
      "name": "Emily - Easygoing Pal",
      "gender": "feminine",
      "tone": "Cheerful voice with warm and welcoming tone that feels natural and easy to connect with",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0d2162c2-2fe9-40a7-b3c1-43eab576a64b",
      "name": "Shelly - Warm Companion",
      "gender": "feminine",
      "tone": "Friendly voice with a bright, approachable tone that feels natural and welcoming in any setting",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "cb6a8744-41b0-4cdc-b643-fabeb545c6a9",
      "name": "Laurel - Caring Sister",
      "gender": "feminine",
      "tone": "Warm voice with gentle empathy and clarity, perfect for heartfelt conversations and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6cb8801d-259a-4bdc-978f-b45808d58cd3",
      "name": "Jeremy - Energetic Promoter",
      "gender": "masculine",
      "tone": "High energy voice with clear and engaging tone, perfect for advertisements and promotions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "efa653e5-314d-46ca-9f90-70ac7d6ca71e",
      "name": "Kurt - Phone Support",
      "gender": "masculine",
      "tone": "Engaging male voice with expressive tone and natural warmth, ideal for customer service",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "afb19d1b-4044-4f34-a962-f4aef640a002",
      "name": "Zander - Energetic Announcer",
      "gender": "masculine",
      "tone": "Enthusiastic voice with energetic delivery and bold tone, perfect for advertisements and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e4d5f4c4-6601-4779-bee1-b3c14d629dc6",
      "name": "Jillian - Happy Spirit",
      "gender": "feminine",
      "tone": "Cheerful voice with lively warmth and friendly tone, perfect for upbeat conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c58bda25-abd5-4c72-97a2-4dbe049b368d",
      "name": "Garrett - Enthusiastic Pal",
      "gender": "masculine",
      "tone": "Upbeat voice with bright energy and confident tone, perfect for lively conversations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f688c0a6-dddd-48ba-8246-c099d494a162",
      "name": "Romeo - Calm Narrator",
      "gender": "masculine",
      "tone": "Relaxing voice with smooth depth and calm pacing, perfect for storytelling and immersive narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3d9b50f9-10c5-4026-9ae1-c4a698f67fc5",
      "name": "Marjorie - Encouraging Aunt",
      "gender": "feminine",
      "tone": "Encouraging matured voice with warm reassurance and steady tone, perfect for motivational and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a924b0e6-9253-4711-8fc3-5cb8e0188c94",
      "name": "Noah - Calming Presence",
      "gender": "masculine",
      "tone": "Slow-paced voice with gentle warmth and soothing tone, perfect for ASMR and relaxation content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "eb649460-7e23-43bc-ad20-0a7a2749b938",
      "name": "Kim - Cheerful Pal",
      "gender": "feminine",
      "tone": "Friendly voice with a smooth, easygoing tone",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1f575487-6f3d-40e0-862a-814f55b5fb15",
      "name": "Ariane - Captivating Tone",
      "gender": "feminine",
      "tone": "Engaging voice with expressive warmth and clarity, perfect for drawing listeners into any…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "050f5a7a-9d2b-4b76-84e3-2d056a0a3eb0",
      "name": "Kelsey - Ball of energy",
      "gender": "feminine",
      "tone": "Upbeat voice with lively energy and friendly warmth, perfect for energetic and engaging…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6fbca103-0f7f-4e49-97ed-49a53b4f3534",
      "name": "Maxine - Relaxed Energy",
      "gender": "feminine",
      "tone": "Smooth voice with a calm, laid-back tone that brings an easy sense of comfort to any conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "87041166-c212-4838-9028-05d7437df750",
      "name": "Aubrey - Easygoing Pal",
      "gender": "feminine",
      "tone": "Warm voice with a relaxed, natural tone that feels friendly and effortlessly relatable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6fccb471-26f7-4f7a-93dd-542935db6c20",
      "name": "Wesley - Chill Flow",
      "gender": "masculine",
      "tone": "Casual voice with a relaxed, friendly tone that feels natural and easy to listen to",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9329fbdb-e285-4fba-95ec-592e15f14476",
      "name": "Rory - Maternal Vibe",
      "gender": "feminine",
      "tone": "Motherlike female voice with a calm, nurturing tone that brings warmth and reassurance to any…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "eef47c0d-cb49-4160-a4a0-6b97ed4c81e6",
      "name": "Isla - Serene Flow",
      "gender": "feminine",
      "tone": "Calm voice with gentle warmth and steady rhythm, perfect for yoga, meditation, and relaxation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "69092565-1c93-4a88-9f2c-ac8cddaf9f65",
      "name": "Janice - Engaging Tone",
      "gender": "feminine",
      "tone": "Engaging voice with a casual, friendly tone that draws listeners in and keeps conversations lively",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "17488b72-f815-44d8-bdd9-869971c3ec06",
      "name": "Steven - Big Brother",
      "gender": "masculine",
      "tone": "Conversational voice with a relaxed, natural tone that feels genuine and easy to engage with",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d6b0c62a-c7ff-477c-9a1f-eadd64b94360",
      "name": "Melina - Bright Spirit",
      "gender": "feminine",
      "tone": "Outgoing voice with lively warmth and friendly tone, perfect for casual chats and everyday…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "59697755-8cfb-4ccf-9da4-f2201d06b067",
      "name": "Dominic - Sportscaster",
      "gender": "masculine",
      "tone": "Strong voice with commanding projection and energetic tone, perfect for sports commentary and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "80c81aee-b6ad-4d12-9af8-a9c79c2e141d",
      "name": "Aina - Meditation Guru",
      "gender": "feminine",
      "tone": "Calm voice with soothing balance and gentle rhythm, ideal for meditation, mindfulness, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ca31ce53-ebf6-4e51-b87d-2f65d5d1f7f8",
      "name": "Vivian - Fierce Narrator",
      "gender": "feminine",
      "tone": "Voice with rich emotion and expressive depth, perfect for dramatic readings and heartfelt narratio",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "aef96ff9-4578-4b5d-9744-7fb347cbe4d4",
      "name": "Holly - Joyful Presence",
      "gender": "feminine",
      "tone": "Cheerful voice with bright warmth and friendly energy, perfect for engaging conversations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b58b6b46-1a27-46ba-8648-bc203a5d394e",
      "name": "Mason - Calm Vibe",
      "gender": "masculine",
      "tone": "Chill voice with a smooth, conversational tone that feels relaxed and genuine",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3bf35adc-bcc4-464b-b834-c90c88cf6492",
      "name": "Spencer - Chill Gentleman",
      "gender": "masculine",
      "tone": "Casual voice with an engaging, upbeat tone that feels friendly and effortlessly conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9c8880b2-ccf9-4730-b805-cea23df247d7",
      "name": "Conrad - Seasoned Support",
      "gender": "masculine",
      "tone": "Mature, confident voice with composed authority and clear tone, perfect for professional or…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5cf0e4d9-ca2b-4fd5-81fa-89db3b645539",
      "name": "Derrick - Professional Man",
      "gender": "masculine",
      "tone": "No-nonsense voice with steady confidence and clear tone, ideal for customer service and tech support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c0f43c66-9f21-4034-b485-8f1d3340d759",
      "name": "Clarkson - Executive Tone",
      "gender": "masculine",
      "tone": "Businesslike voice with confident tone and professional delivery, perfect for corporate and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "643f5eee-459d-4b41-b4fc-0b8407139be6",
      "name": "Vicky - Businesswoman",
      "gender": "feminine",
      "tone": "Clear and crisp voice with precise delivery and bright tone, ideal for professional and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "dcc82bcd-647e-4478-955f-8232d5122f8b",
      "name": "Melanie - Lively Spirit",
      "gender": "feminine",
      "tone": "Enthusiastic voice with bright, engaging energy that brings excitement to any conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "045f0292-0731-4a4c-971d-64594fc2c35a",
      "name": "Quinn - Calm Authority",
      "gender": "feminine",
      "tone": "Confident voice with clear articulation and poised tone, perfect for presentations and customer…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2948c301-9211-4112-8f36-4c3fc836ef12",
      "name": "Bryce - Clear Explainer",
      "gender": "masculine",
      "tone": "Confident voice with clear enunciation and strong delivery, ideal for professional and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "49808e4c-998a-40a8-b2ea-8ac8e8ce779e",
      "name": "Marvin - Steady Ally",
      "gender": "masculine",
      "tone": "Deep, comforting voice with calm authority and warmth, perfect for reassuring and professional…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "86600680-b836-41e1-9916-8475728dcc14",
      "name": "Tiffany - Dynamic Presence",
      "gender": "feminine",
      "tone": "Engaging voice with lively clarity and confident warmth, ideal for keeping listeners interested…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7a8ae0b6-504a-49af-92d3-4e7e2eb84ca1",
      "name": "Eliott - Positive Spirit",
      "gender": "masculine",
      "tone": "Approachable and cheerful voice with bright warmth that instantly connects and uplifts listeners",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b5c1bab5-f036-481f-9295-4db6f06f6443",
      "name": "Jamie - Comforting Presence",
      "gender": "feminine",
      "tone": "Casual voice with a warm, friendly tone that feels like chatting with a close friend",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "cd6256ef-2b2a-41f6-a8d8-c1307af5061f",
      "name": "Preston - Relatable Pal",
      "gender": "masculine",
      "tone": "Confident voice with expressive tone and charismatic delivery, great for engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3ccc4544-84f7-45e3-ae57-5c52b5a1fac6",
      "name": "Aiden - Yogi",
      "gender": "masculine",
      "tone": "Soothing voice with calm depth and gentle pacing, perfect for peaceful narrations and relaxation…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4b1e0bf9-53a0-4e9e-8664-ba1314dbcb38",
      "name": "Kelly - Friendly Spirit",
      "gender": "feminine",
      "tone": "Casual voice with a friendly, natural tone that feels easygoing and approachable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e5a6cd18-d552-4192-9533-82a08cac8f23",
      "name": "Patricia - Veteran Support",
      "gender": "feminine",
      "tone": "Matured voice with lively warmth and enthusiasm, perfect for engaging and energetic customer service",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ea93f57f-7c71-4d79-aeaa-0a39b150f6ca",
      "name": "Diana - Gentle Mom",
      "gender": "feminine",
      "tone": "Matured voice with a casual, friendly tone that feels warm, relatable, and easy to connect with",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "18f8d87b-0da9-4efa-b504-4580e303f7db",
      "name": "Colby - Lively Guy",
      "gender": "masculine",
      "tone": "Casual voice with an engaging, upbeat tone that brings energy and friendliness to any conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "fdf6303b-4cfa-4f8e-b7ae-acb398984cf9",
      "name": "Harley - Comforting Voice",
      "gender": "masculine",
      "tone": "Casual voice with a relaxed, natural tone that feels approachable and genuine",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ea7c252f-6cb1-45f5-8be9-b4f6ac282242",
      "name": "Logan - Approachable Friend",
      "gender": "masculine",
      "tone": "Casual voice with an easy, conversational tone that feels natural and approachable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "63927f41-9616-4ac2-89cf-f3afa346e0ef",
      "name": "Selene - Soothing Aura",
      "gender": "feminine",
      "tone": "Relaxing and calm voice with gentle flow and serene tone, ideal for meditation and mindfulness…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3308b492-50cc-417e-89dd-1f446c574546",
      "name": "Tara - Confident Ally",
      "gender": "feminine",
      "tone": "Confident voice with clear, composed tone, perfect for professional and customer service settings",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "320f7211-3dc3-4292-89b1-3661e8cac27c",
      "name": "Evelyn - Peaceful Whisper",
      "gender": "feminine",
      "tone": "Calm voice with soft warmth and gentle pacing, ideal for soothing narrations and ASMR",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a2364c9d-1fe3-4553-9eff-100c4fe5ffc8",
      "name": "Marge - Seasoned Grace",
      "gender": "feminine",
      "tone": "Wise matured voice with expressive warmth and character, perfect for storytelling and entertainment",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2d5b8c3a-116c-4741-acaf-ba4fa289eba2",
      "name": "Benji - Joyful Spirit",
      "gender": "masculine",
      "tone": "Excited and cheerful voice with bright energy and lively tone, perfect for upbeat chats and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "48369ca9-0645-40de-9821-0d55e18a03c2",
      "name": "Zoey - Bright Voice",
      "gender": "feminine",
      "tone": "Upbeat female voice with lively energy and warmth, perfect for energetic and engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "356f4a89-d056-4e2e-8c73-865fa4d3af0a",
      "name": "Chandler - Easygoing Pal",
      "gender": "masculine",
      "tone": "Casual male voice with a warm, natural tone that feels friendly and effortlessly relatable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d6905573-8e91-4e32-b103-fd4d1205cd87",
      "name": "Mindy - Spirited Ally",
      "gender": "feminine",
      "tone": "Enthusiastic female voice with bright energy and cheerful tone, great for lively conversations…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "23112795-d54e-4560-9568-791a87c30201",
      "name": "Darius - Engaging Narrator",
      "gender": "masculine",
      "tone": "Husky matured male voice with rich texture and commanding tone, ideal for engaging story telling…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1ac31ebd-9113-405b-9d80-4a4bbbeea91c",
      "name": "Kayla - Easygoing Pal",
      "gender": "feminine",
      "tone": "Casual female voice with a friendly, natural tone that feels effortless and engaging in conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1628cfcd-a161-4e47-98ff-46bffa4ab290",
      "name": "Graham - Assured Helper",
      "gender": "masculine",
      "tone": "Confident male voice with a clear, reassuring tone, perfect for professional and customer…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a892d232-f705-40d7-bc8d-e368b295ec2a",
      "name": "Harlan - Vintage Tone",
      "gender": "masculine",
      "tone": "Deep male voice with classic resonance and smooth authority, reminiscent of an old radio announcer",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3d83e30f-c31b-4f26-b442-7075feafa53a",
      "name": "Wade - Southern Soul",
      "gender": "masculine",
      "tone": "Country-sounding male voice with a warm drawl and genuine charm, perfect for friendly storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "87a983d8-3471-4c4b-9ade-f1d10a4110ac",
      "name": "Devin - Relaxed Spirit",
      "gender": "masculine",
      "tone": "Laidback male voice with a smooth, easygoing tone that feels relaxed and effortlessly cool.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3f38cbe2-ce6a-4051-b5dc-2b2ee20b9bc1",
      "name": "Sasha - Cool Friend",
      "gender": "feminine",
      "tone": "Chill female voice with a smooth, laid-back tone that brings ease and calm to any conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b2222537-1561-4425-8c3c-e1aca96ad853",
      "name": "Dylan - Chill Companion",
      "gender": "masculine",
      "tone": "Casual male voice with an easy, conversational tone that feels friendly and down-to-earth",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8cbfe3ab-8364-4e72-b606-93f749519c66",
      "name": "Shane - Helpful Guide",
      "gender": "masculine",
      "tone": "Casual male voice with clear, steady delivery that makes troubleshooting steps easy to follow…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d2c66146-c1c8-4c3a-9870-38e5a6b72442",
      "name": "Lawson - Suave Storyteller",
      "gender": "masculine",
      "tone": "Charming matured male voice with smooth delivery and refined tone, perfect for narrations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "083de431-6b5c-4b18-a2dc-264eafa205f2",
      "name": "Diana - Animated Narrator",
      "gender": "feminine",
      "tone": "Chirpy matured female voice with expressive warmth and lively cadence, perfect for engaging…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "cec7cae1-ac8b-4a59-9eac-ec48366f37ae",
      "name": "Haley - Engaging Friend",
      "gender": "feminine",
      "tone": "Casual female voice with a relaxed, friendly tone that feels natural and easy to engage with",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "5319c0b1-3dd1-4c00-b721-bfd2ec88ef56",
      "name": "Julian - Vibrant Voice",
      "gender": "masculine",
      "tone": "Friendly and cheerful male voice with uplifting warmth, great for feel-good narrations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f4a3a8e4-694c-4c45-9ca0-27caf97901b5",
      "name": "Gavin - Friendly Vibe",
      "gender": "masculine",
      "tone": "Casual male voice with a relaxed, conversational tone that feels approachable and genuine",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8a1b8af0-c4f6-423f-a268-5507fd4aefdf",
      "name": "Denise - Professional Woman",
      "gender": "feminine",
      "tone": "Professional female voice with confident clarity and polished tone, ideal for corporate and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "ed82c17b-4704-4d34-be43-5d19065acdf1",
      "name": "Carl - Steady Storyteller",
      "gender": "masculine",
      "tone": "Matured male voice with calm depth and measured pacing, perfect for narrations and documentaries",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "bbc5d060-50e1-45a3-87ff-191b8cea3092",
      "name": "Jett - Helpful Pal",
      "gender": "masculine",
      "tone": "Casual male voice with an easygoing rhythm and friendly tone that feels natural and relatable",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "19e399df-5b30-4fba-9d1d-99434f993614",
      "name": "Edna - Graceful Veteran",
      "gender": "feminine",
      "tone": "Matured female voice with gentle wisdom and poise, perfect for thoughtful narration and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "b9cf5ec3-eaa4-46a5-a5b2-b0d0f22395a2",
      "name": "Caleb - Seasoned Pro",
      "gender": "masculine",
      "tone": "Confident male voice with authoritative clarity, perfect for delivering expert insights and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4c2dcd38-5608-45ca-8f11-51c88208d01c",
      "name": "Orin - Velvet Gentleman",
      "gender": "masculine",
      "tone": "Deep, silky male voice that delivers authority and allure, perfect for impactful ads and promos",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "90c896fa-aaa1-41af-a612-5267636440a3",
      "name": "Dean - Laidback Pal",
      "gender": "masculine",
      "tone": "Casual male voice with a relaxed, natural tone that feels easy to listen to and effortlessly genuine",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "efc5488b-5429-4e72-aaa2-570981cf47d9",
      "name": "Lacey - Sunny Soul",
      "gender": "feminine",
      "tone": "Cheerful and friendly female voice with bright energy that uplifts and engages listeners instantly",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "cc00e582-ed66-4004-8336-0175b85c85f6",
      "name": "Dana - Balanced Spirit",
      "gender": "feminine",
      "tone": "Neutral female voice with clear articulation and calm tone, ideal for versatile conversational…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3af40927-948e-429b-b92d-e2158f79fb9f",
      "name": "Cera - Lighthearted Muse",
      "gender": "feminine",
      "tone": "Casual female voice with an easy, conversational flow that feels natural and friendly",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "d709a7e8-9495-4247-aef0-01b3207d11bf",
      "name": "Donny - Steady Presence",
      "gender": "masculine",
      "tone": "Neutral male voice with balanced tone and clarity, adaptable for a wide range of casual speaking…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "64b2a604-f0de-449f-9d90-255602357c05",
      "name": "Elise - Helpful Voice",
      "gender": "feminine",
      "tone": "Casual female voice with a smooth, approachable tone that feels effortless and natural in…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c7c790c5-2bf4-47e4-bc83-5f43e61f3803",
      "name": "Reese - Warm Companion",
      "gender": "feminine",
      "tone": "Casual, friendly female voice with a bright and welcoming tone suited for everyday conversations.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1ce291a1-0771-4732-a3f7-8cca29bf055f",
      "name": "Ralph - Dynamic Commentator",
      "gender": "masculine",
      "tone": "Matured male voice with powerful projection and crisp delivery, perfect for announcements and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "dbfa416f-d5c3-4006-854b-235ef6bdf4fd",
      "name": "Damon - Commanding Narrator",
      "gender": "masculine",
      "tone": "Deep and serious male voice with steady gravitas, ideal for documentaries and impactful storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "6776173b-fd72-460d-89b3-d85812ee518d",
      "name": "Jace - Cool Conversationalist",
      "gender": "masculine",
      "tone": "Friendly and chill male voice with an easygoing tone that feels relaxed and natural",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "921034a2-aace-4ef7-87b1-b9bc455c9a15",
      "name": "Edric - Refined Mentor",
      "gender": "masculine",
      "tone": "Matured male voice with steady pacing and clear intonation, delivering messages with poise and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c78dd7ae-6692-4c44-a2a2-834e365afe60",
      "name": "Clark - Trustworthy Expert",
      "gender": "masculine",
      "tone": "Approachable male voice with a confident, knowledgeable tone ideal for customer service and support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0834f3df-e650-4766-a20c-5a93a43aa6e3",
      "name": "Leo - Genuine Companion",
      "gender": "masculine",
      "tone": "Friendly and approachable male voice that brings warmth and ease to any interaction",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4cf80313-54dc-4ca9-a17c-3e5b8f68a78c",
      "name": "Hugh - Confident Veteran",
      "gender": "masculine",
      "tone": "Seasoned male voice with rich character and charisma, great for lively ads and engaging…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8d7d11ff-d985-48a2-a737-1da0b6fedc8b",
      "name": "Ronan - Warm Buddy",
      "gender": "masculine",
      "tone": "Friendly male voice with an easygoing tone that feels natural and inviting in any context",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3f04e815-3260-4f50-8fd9-af9c657be4c2",
      "name": "Arvin - Reliable Guide",
      "gender": "masculine",
      "tone": "Clear, steady male voice that communicates instructions and troubleshooting steps with…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f4c1a0b2-669d-403f-b440-4b34b34856aa",
      "name": "Nora - Calm Companion",
      "gender": "feminine",
      "tone": "Balanced, neutral female voice that sounds natural and approachable for everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "cbaf8084-f009-4838-a096-07ee2e6612b1",
      "name": "Maya - Easygoing Ally",
      "gender": "feminine",
      "tone": "Friendly, casual female voice with clear articulation, ideal for natural conversations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c1b9a03e-747f-40ad-8e7b-18caf8aaac0b",
      "name": "Lira - Tranquil Voice",
      "gender": "feminine",
      "tone": "Soothing female voice with gentle warmth, ideal for calm narrations and ASMR",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e2d08065-b658-466b-ad52-cef8ee21d307",
      "name": "Natasha - Upbeat Guide",
      "gender": "feminine",
      "tone": "English female adult voice with a lively, upbeat tone for energetic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9a0894a9-28f0-436e-9a1d-e92bccbce4dd",
      "name": "Albert - Firm Guide",
      "gender": "masculine",
      "tone": "English male adult voice with a firm and authoritative tone for providing clear instructions and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "710feaa3-b550-42f3-b3eb-6f37f2a7cc0a",
      "name": "Tanner - Upbeat Assistant",
      "gender": "masculine",
      "tone": "English male adult voice with an upbeat and energetic tone",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f762e181-ddc7-486e-9a48-636bd7e229d4",
      "name": "Chloe - Persuasive Lady",
      "gender": "feminine",
      "tone": "English female adult voice with a confident and persuasive tone, able to influence and engage…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3ef78ba6-9aaa-46a2-b5b5-f9ded76a2370",
      "name": "Serena - Laidback Girl",
      "gender": "feminine",
      "tone": "Female adult voice with a relaxed, easygoing tone and laid-back delivery",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "0d42f0f6-c019-4082-b250-1c16133d1c82",
      "name": "Howard - Approachable Man",
      "gender": "masculine",
      "tone": "Male adult voice with a clear, approachable tone and steady delivery",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a7a59115-2425-4192-844c-1e98ec7d6877",
      "name": "Amber - Warm Support Agent",
      "gender": "feminine",
      "tone": "English female adult voice with a cheerful yet deeper tone, striking a balance of warmth and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "f39d8500-0d9b-4b8b-a080-38f5188f5892",
      "name": "Jewel - Commercial Announcer",
      "gender": "feminine",
      "tone": "Smooth, confident, and engaging female voice for advertising, promos, and high-impact brand…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "3d808d23-cb09-4c39-8afd-528e209cba4f",
      "name": "Brent - Steady Conversationalist",
      "gender": "masculine",
      "tone": "English male adult voice with a calm, steady, and composed delivery",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "1b4ea5fb-b1c0-43ee-a7be-4e315878c2b1",
      "name": "Monica - Emotive Voice",
      "gender": "feminine",
      "tone": "English female adult voice with rich emotional range and expressive delivery",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "efd255c7-f030-43d3-b5d8-c7b72063be70",
      "name": "Todd - Matter of Fact Salesman",
      "gender": "masculine",
      "tone": "English male adult voice with a direct, matter-of-fact delivery",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "7edf9efb-58fc-46ba-a648-3a00a86b111b",
      "name": "Elliott - Reflective Storyteller",
      "gender": "masculine",
      "tone": "English male adult voice with a soft, melancholic tone and a questioning inflection for…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "01eaafa9-308a-4276-a017-6ab0cf061b1f",
      "name": "Clara - Instructor",
      "gender": "feminine",
      "tone": "Middle-aged American female voice with a clear tone and precise enunciation for instructions,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "03b1c65d-4b7f-4c09-91a8-e2f6f78cb2c9",
      "name": "Molly - Upbeat Conversationalist",
      "gender": "feminine",
      "tone": "Bright and cheerful American-accented female voice for upbeat conversations, advertisements, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "92c41dd4-04aa-45de-8504-a92b40cb8818",
      "name": "Connor - Grateful Person",
      "gender": "masculine",
      "tone": "Expressive American adult male voice with a grateful yet firm tone for speeches, storytelling,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "2f22b9bc-b0eb-4cb6-b5ae-0c099a0fdfad",
      "name": "Scott - Sportscaster",
      "gender": "masculine",
      "tone": "Energetic American adult male voice with the excitement of a sportscaster for live commentary,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "4e41a434-85fc-4614-b203-af79ba44d473",
      "name": "Sienna - Encourager",
      "gender": "feminine",
      "tone": "Soft-spoken American-accented female voice with a motivating and reassuring tone for guidance,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "09ed0318-2f4a-41b1-abe5-d11da7537c31",
      "name": "Daphne - Excited Woman",
      "gender": "feminine",
      "tone": "Expressive and upbeat American-accented female voice with an exciting tone for ads,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "79bfcec0-720c-41f2-a33a-f12383e9627f",
      "name": "Wang - Guide",
      "gender": "masculine",
      "tone": "Clear and firm adult male voice with an authoritative tone for customer support, giving…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "8918ddfe-2ad4-4cc8-a573-e020ca13f3f5",
      "name": "Erin - Joyful Guide",
      "gender": "feminine",
      "tone": "Cheerful and optimistic adult female voice for upbeat conversations, advertisements, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "46788d8e-cdf9-4d5c-9125-094eb2e4d44c",
      "name": "Brittany - Intense Performer",
      "gender": "feminine",
      "tone": "Strong and aggressive American-accented female voice for intense dialogue, dramatic roles, or…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "e2d48e7b-cd73-4c4c-bc1e-f232580e8709",
      "name": "Adrian - Explorer",
      "gender": "masculine",
      "tone": "Deep American adult male voice with a curious and engaging tone for explorations, documentaries,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "c63361f8-d142-4c62-8da7-8f8149d973d6",
      "name": "Krishna - Friendly Pal",
      "gender": "masculine",
      "tone": "Easygoing adult male voice with a slight Indian accent for casual conversations, approachable…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "9287676d-f0cc-423f-ac03-3b3c7242f091",
      "name": "Allen - Modern Voice",
      "gender": "masculine",
      "tone": "Confident young adult male voice with a neutral American accent for presentations, ads, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "a3520a8f-226a-428d-9fcd-b0a4711a6829",
      "name": "Reflective Woman",
      "gender": "feminine",
      "tone": "This voice is even, full, and reflective, perfect for a young narrator for an audiobook or movie",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "en",
      "sampleDir": "samples/cartesia-sonic-3-en"
    },
    {
      "voiceId": "15d0c2e2-8d29-44c3-be23-d585d5f154a1",
      "name": "Pedro - Formal Speaker",
      "gender": "masculine",
      "tone": "Formal and steady Mexican adult for clear and concise exchanges of information",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "b0689631-eee7-4a6c-bb86-195f1d267c2e",
      "name": "Emilio - Friendly Optimist",
      "gender": "masculine",
      "tone": "Upbeat voice with a friendly tone for positive customer service interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "9d8c6b2e-0a23-4a15-ae1b-121d5b5af417",
      "name": "Nuria - Trusted Advisor",
      "gender": "feminine",
      "tone": "Calm, dependable Spanish female perfect for professional communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "13ff5deb-2591-42ad-a356-63a04e524411",
      "name": "Marcos - Steady Advisor",
      "gender": "masculine",
      "tone": "Calm, measured Spanish male suited for professional communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "538a8872-3799-4df5-b373-b78493b766c6",
      "name": "Blanca - Graceful Host",
      "gender": "feminine",
      "tone": "Warm, welcoming Spanish female that puts listeners at ease instantly.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "de38f545-c574-44e8-9b54-a7d6fec1c6b1",
      "name": "Marta - Friendly Guide",
      "gender": "feminine",
      "tone": "Approachable Spanish female ideal for customer care and support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "3597a26f-80ef-4bd5-8101-9699bc764917",
      "name": "Ximena - Calm Navigator",
      "gender": "feminine",
      "tone": "Steady, clear Latina female ideal for guided experiences.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "079e3a17-5545-4bc5-93e3-e11df6fe37b8",
      "name": "Rodrigo - Calm Companion",
      "gender": "masculine",
      "tone": "Gentle, reassuring Latino male perfect for customer service.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "d46e87a1-7c6d-4b18-9359-926f4a35ffdf",
      "name": "Andres - Trusted Voice",
      "gender": "masculine",
      "tone": "Dependable, measured Mexican male ideal for professional communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "c0925108-d541-4dc4-bbae-39f4e57ba10c",
      "name": "Lucia - Radiant Host",
      "gender": "feminine",
      "tone": "Bright, welcoming Spanish female that captures attention for events.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "bef24f4f-adc9-4cef-acbf-cc1ceb98224b",
      "name": "Santiago\t- Modern Navigator",
      "gender": "masculine",
      "tone": "Crisp, approachable Mexican male ideal for guided communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "2fc4f1ec-bfd0-46f1-8e6d-d4279eaaf838",
      "name": "Mateo\t- Friendly Host",
      "gender": "masculine",
      "tone": "Warm, genuine Mexican male perfect for conversational platforms.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "b4b8e2af-6139-466e-a93a-30c20d2e1fc5",
      "name": "Fernanda - Friendly Guide",
      "gender": "feminine",
      "tone": "Approachable, Mexican female ideal for customer care and support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "59b37da2-92ba-401a-9e4e-b1d16898d9bc",
      "name": "Andrea - Clear Communicator",
      "gender": "feminine",
      "tone": "Professional Spanish female for direct and reliable support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "e361b786-2768-4308-9369-a09793d4dd73",
      "name": "Paola - Expressive Performer",
      "gender": "feminine",
      "tone": "Bold and lively voice for expressive performances and engaging content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "ae823354-f9be-4aef-8543-f569644136b4",
      "name": "Mariana - Nurturing Guide",
      "gender": "feminine",
      "tone": "Motherly voice with a calm, nurturing tone",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "162e0f37-8504-474c-bb33-c606c01890dc",
      "name": "Catalina - Neighborly Guide",
      "gender": "feminine",
      "tone": "Natural, approachable for everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "ccfea4bf-b3f4-421e-87ed-dd05dae01431",
      "name": "Alondra - Reassuring Sister",
      "gender": "feminine",
      "tone": "Warm, friendly voice with a supportive, big-sister tone",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "02aeee94-c02b-456e-be7a-659672acf82d",
      "name": "Benito - Digital Voice",
      "gender": "masculine",
      "tone": "Consistent voice for clear, conversational exchanges",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "cefcb124-080b-4655-b31f-932f3ee743de",
      "name": "Elena - Narrator",
      "gender": "feminine",
      "tone": "Smooth and grounded female with a soft Castilian accent for podcasts and meditation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "79743797-2087-422f-8dc7-86f9efca85f1",
      "name": "Fran - Confident Young Professional",
      "gender": "masculine",
      "tone": "Confident and engaging male for conversational AI and phone interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "c0c374aa-09be-42d9-9828-4d2d7df86962",
      "name": "Isabel - Teacher",
      "gender": "feminine",
      "tone": "Smooth and approachable female with a gentle Castilian accent for guidance and teaching",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "2695b6b5-5543-4be1-96d9-3967fb5e7fec",
      "name": "Agustin - Clear Storyteller",
      "gender": "masculine",
      "tone": "Intentional, clear adult for concise reports or storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "d4db5fb9-f44b-4bd1-85fa-192e0f0d75f9",
      "name": "Paloma - Clear Presenter Woman",
      "gender": "feminine",
      "tone": "Clear and professional adult woman for reports, public speaking and customer assistance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "b5aa8098-49ef-475d-89b0-c9262ecf33fd",
      "name": "Luis - News Caster",
      "gender": "masculine",
      "tone": "Clear and distinctive male with a refined Castilian accent for clear communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "846fa30b-6e1a-49b9-b7df-6be47092a09a",
      "name": "Pablo - Clear Storyteller",
      "gender": "masculine",
      "tone": "Smooth and captivating male with a Castilian accent for conversational AI and interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "b042270c-d46f-4d4f-8fb0-7dd7c5fe5615",
      "name": "Hector - Tour Leader",
      "gender": "masculine",
      "tone": "Energetic and captivating male with a bright Castilian accent for providing instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "5ef98b2a-68d2-4a35-ac52-632a2d288ea6",
      "name": "Gabriel - Serious Old Man",
      "gender": "masculine",
      "tone": "Serious, elderly Spanish man for slow and insightful stories",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "5c5ad5e7-1020-476b-8b91-fdcbe9cc313c",
      "name": "Daniela - Relaxed Woman",
      "gender": "feminine",
      "tone": "Calm and trusting Mexican accented female for natural conversations and efficient assistance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "58e531e3-b212-49df-adee-c335a19c2429",
      "name": "Gonzalo - Grounded Storyteller",
      "gender": "masculine",
      "tone": "Warm, authentic Spanish male perfect for natural communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "f4d6bb07-f876-4464-ba70-cd48d8701890",
      "name": "Adriana - Bright Entertainer",
      "gender": "feminine",
      "tone": "Bright, expressive voice for promotional and entertainment use",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "7c1ecd2d-1c83-4d5d-a25c-b3820a274a2e",
      "name": "Jeronimo - Empathetic Advisor",
      "gender": "masculine",
      "tone": "Friendly, emotionally aware voice for trust-based customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "dbaa1a0d-e004-442d-866f-5431b18d8d54",
      "name": "Guadalupe - Wise Storyteller",
      "gender": "feminine",
      "tone": "Character-rich voice for storytelling and dramatic narration",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "c68a8bd0-f99e-4e7f-915d-a097da6d024c",
      "name": "Juanita - Helpful Companion",
      "gender": "feminine",
      "tone": "Friendly, reassuring voice for customer support and assistance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "bef2ba57-5c10-433b-b215-3bef35110a81",
      "name": "Camila - Happy Conversationalist",
      "gender": "feminine",
      "tone": "Lively voice for relaxed, casual conversations and light support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "30212483-5c20-479c-8121-f93cd24e30a6",
      "name": "Camila",
      "gender": "feminine",
      "tone": "Lively voice for relaxed, casual conversations and light support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "9ebc775b-c579-4c31-b37c-2306cbe9cc91",
      "name": "Carlos",
      "gender": "masculine",
      "tone": "Warm, lively young adult male voice for expressive narrations and upbeat advertising.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "d3793b7b-4996-409c-9d59-96dd09f47717",
      "name": "Renata - Cheerful Conversationalist",
      "gender": "feminine",
      "tone": "Lively and upbeat matured voice, ideal for ads and narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "7b001dff-b8b2-4da7-92e4-5c794798effa",
      "name": "Jorge - Regular Guy",
      "gender": "masculine",
      "tone": "Seasoned, relaxed voice with a warm tone, ideal for casual narration and conversational support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "3a35daa1-ba81-451c-9b21-59332e9db2f3",
      "name": "Alejandro - Calm Mentor",
      "gender": "masculine",
      "tone": "Warm voice with a rich tone and calm cadence, ideal for reflective narration, heartfelt…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "948196a7-fe02-417b-9b6d-c45ee0803565",
      "name": "Manuel - Newsman",
      "gender": "masculine",
      "tone": "Clear, mature male voice with a steady tone and authoritative presence, ideal for narrations,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "b503f001-80b8-49d3-8666-8d7700fc5ca2",
      "name": "Liliana - Doting Mother",
      "gender": "feminine",
      "tone": "Gentle, motherly middle-aged female voice for nurturing conversations, wellness guidance, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "fb936dd1-66ea-43a0-86bd-18a6203dcda2",
      "name": "Rosa - Optimist Mother",
      "gender": "feminine",
      "tone": "Happy, approachable middle-aged female voice for cheerful narration and casual conversations.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "399002e9-7f7d-42d4-a6a8-9b91bd809b9d",
      "name": "Diego - Hype Guy",
      "gender": "masculine",
      "tone": "Lively young adult male voice for energetic, natural-sounding conversations and product-forward…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "ad8eee76-d702-4a1f-a1bd-7596755ae4c9",
      "name": "Valeria - Cheerful Promoter",
      "gender": "feminine",
      "tone": "Expressive and upbeat young adult female voice for energetic commercials, entertainment, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "e9f0368b-3662-4a01-b037-e13ca5203c74",
      "name": "Javier - Gentle Advisor",
      "gender": "feminine",
      "tone": "Approachable adult male voice for casual conversations and natural dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "727f663b-0e90-4031-90f2-558b7334425b",
      "name": "Carmen - Friendly Neighbor",
      "gender": "feminine",
      "tone": "Natural adult female voice for casual conversations and everyday interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "es",
      "sampleDir": "samples/cartesia-sonic-3-es"
    },
    {
      "voiceId": "2835e382-643b-4ac6-8f6c-74df549a7ad0",
      "name": "Milla - Modern Communicator",
      "gender": "feminine",
      "tone": "Crisp, natural Finnish female for customer assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fi",
      "sampleDir": "samples/cartesia-sonic-3-fi"
    },
    {
      "voiceId": "7849a11e-4107-44ae-bc7e-77bea41ec019",
      "name": "Matti - Measured Manager",
      "gender": "masculine",
      "tone": "Steady adult male for structured professional interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fi",
      "sampleDir": "samples/cartesia-sonic-3-fi"
    },
    {
      "voiceId": "8ccd7fcd-846a-4594-bde2-5feec2cba73a",
      "name": "Jari - Reliable Representative",
      "gender": "masculine",
      "tone": "Steady adult male for direct and efficient dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fi",
      "sampleDir": "samples/cartesia-sonic-3-fi"
    },
    {
      "voiceId": "ae1a833b-0d95-4b7f-8d05-d6418c6f8049",
      "name": "Mikko - Narration Expert",
      "gender": "masculine",
      "tone": "Firm and strong adult male voice for narration, audiobooks, and authoritative communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fi",
      "sampleDir": "samples/cartesia-sonic-3-fi"
    },
    {
      "voiceId": "65c34eec-42c9-4a75-a8bd-b676fb847b72",
      "name": "Helmi - Warm Friend",
      "gender": "feminine",
      "tone": "Friendly adult female voice for casual conversations and everyday chat",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fi",
      "sampleDir": "samples/cartesia-sonic-3-fi"
    },
    {
      "voiceId": "0418348a-0ca2-4e90-9986-800fb8b3bbc0",
      "name": "Antoine - Stern Man",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "7345dfa5-ee04-44d2-abf4-29262b880ab4",
      "name": "Laurent - Dependable Anchor",
      "gender": "masculine",
      "tone": "Strong, definitive French male providing steady corporate messaging.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "93c98a2b-7d15-4f7b-8236-294b1e02b1c0",
      "name": "Mathieu - Assured Expert",
      "gender": "masculine",
      "tone": "Knowledgeable French male conveying confidence for informative readings.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "7c58f4a4-a72c-42fa-a503-41b9408820f3",
      "name": "Inès\t- Poised Communicator",
      "gender": "feminine",
      "tone": "Confident, articulate French female suited for corporate narration.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "faa75703-00e3-4a57-9955-0703001e3231",
      "name": "Amélie - Decisive Agent",
      "gender": "feminine",
      "tone": "Polished female for capable professional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "328e0683-d1a7-4cde-ad46-0ee69a3cbd6a",
      "name": "Roxane - Problem-Solver",
      "gender": "feminine",
      "tone": "Warm French-Canadian female voice for customer service.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "5def377d-908b-4540-8bd7-3c968fcae351",
      "name": "Benoît - Methodical Moderator",
      "gender": "masculine",
      "tone": "Clear, methodical French male for professional customer assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "3817fdb0-7ae1-42d2-b46e-734dd9601bf2",
      "name": "Madeleine - Reliable Resident",
      "gender": "feminine",
      "tone": "Warm, French Canadian female for helpful professional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "ab636c8b-9960-4fb3-bb0c-b7b655fb9745",
      "name": "Erwan - Everyday Speaker",
      "gender": "masculine",
      "tone": "Clear voice for consistent, system-driven conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "a8a1eb38-5f15-4c1d-8722-7ac0f329727d",
      "name": "Calm French Woman",
      "gender": "feminine",
      "tone": "This voice is soft and calm, suited for soothing conversations in French",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "65b25c5d-ff07-4687-a04c-da2f43ef6fa9",
      "name": "Helpful French Lady",
      "gender": "feminine",
      "tone": "This voice is helpful and cheery, like you're talking with a friend in French",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "8832a0b5-47b2-4751-bb22-6a8e2149303d",
      "name": "French Narrator Lady",
      "gender": "feminine",
      "tone": "This voice is velvety and neutral, suited for narrating content in French",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "5c3c89e5-535f-43ef-b14d-f8ffe148c1f0",
      "name": "French Narrator Man",
      "gender": "masculine",
      "tone": "This voice is even and rich, perfect for narrating content in French",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "ab7c61f5-3daa-47dd-a23b-4ac0aac5f5c3",
      "name": "Friendly French Man",
      "gender": "masculine",
      "tone": "This voice is friendly and calm, perfect for French customer support agents",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "cc7d2711-69af-4072-9674-df588dd85682",
      "name": "Maxime - Methodical Moderator",
      "gender": "masculine",
      "tone": "Calm adult male for reassuring and capable service.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "0d09e991-5763-406e-b637-02bc431ef72d",
      "name": "Valérie - Vibrant Voice",
      "gender": "feminine",
      "tone": "Energetic French female for engaging customer communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "c96a7d7d-3457-4979-8665-522f7b3e36fb",
      "name": "Léa - Logical Liaison",
      "gender": "feminine",
      "tone": "Methodical French voice for precise customer guidance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "4325f426-c4e0-418e-a0e5-97fcdfcdf8e6",
      "name": "Camille - Gracious Guide",
      "gender": "feminine",
      "tone": "Elegant, articulated French female for customer support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "cc4276e6-1ebc-429a-8c7d-930993d51abc",
      "name": "Julien - Polished Partner",
      "gender": "masculine",
      "tone": "Professional, warm French male for reliable assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "2d693a9c-fc75-4313-aefb-c9cfaa17dd83",
      "name": "Gerard - Monsieur Noir",
      "gender": "masculine",
      "tone": "Deep, distinct middle-aged male voice for grounded narration and calm, authoritative guidance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "2f8e82c4-cb94-4e6d-8b6a-29bf58ceb60a",
      "name": "Manon - Bright Belle",
      "gender": "feminine",
      "tone": "Upbeat and inviting young female suited for lifestyle and brand narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "c9115185-0086-4cf4-bfdd-0d36425db387",
      "name": "Juliette",
      "gender": "feminine",
      "tone": "Upbeat and inviting young female suited for lifestyle and brand narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "adff5dcb-249f-463f-aa89-d98d8ca05e88",
      "name": "Leo",
      "gender": "masculine",
      "tone": "High energy adult male great for motivational conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "dd951538-c475-4bde-a3f7-9fd7b3e4d8f5",
      "name": "Vanessa",
      "gender": "feminine",
      "tone": "Firm adult female great for providing clear instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "80e11491-2d8a-4361-ac61-c4f3e0a4f7e7",
      "name": "Vincent",
      "gender": "masculine",
      "tone": "Energetic, engaging adult male great for exciting conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "bfd5390b-e4f9-4e44-95ab-9ebd223acd62",
      "name": "Pierre",
      "gender": "masculine",
      "tone": "Professional, calm adult male great for workplace conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "735287ee-ce91-4b08-8de4-63315c5ba1fb",
      "name": "Emmanuelle",
      "gender": "feminine",
      "tone": "Energetic, upbeat young adult female great for friendly conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "187d1cc5-a771-4ccd-9110-9df8c4e39499",
      "name": "Mika - Empathetic Friend",
      "gender": "feminine",
      "tone": "Friendly young adult female for emotive conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "6d912a43-805f-4673-bbc8-a9e6c45a6ad0",
      "name": "Marie-Eve - Team Mentor",
      "gender": "feminine",
      "tone": "Warm firm adult female for workplace conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "ce74c4da-4aee-435d-bc6d-81d1a9367e12",
      "name": "Marc - Conversational Buddy",
      "gender": "masculine",
      "tone": "Friendly adult male for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "22f1a356-56c2-4428-bc91-2ab2e6d0c215",
      "name": "Isabelle - Professional Liaison",
      "gender": "feminine",
      "tone": "Formal adult female for professional conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "68db3d29-e0ab-4d4f-a5d5-e34ee47d38b7",
      "name": "Joris - Command Coach",
      "gender": "masculine",
      "tone": "Deep voice with firm tone for providing instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "5deeaea9-c3cf-4288-82ec-22d8f04eb158",
      "name": "Gerard",
      "gender": "masculine",
      "tone": "Deep, distinct middle-aged male voice for grounded narration and calm, authoritative guidance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "6c64b57a-bc65-48e4-bff4-12dbe85606cd",
      "name": "Eloise - Dialogue Anchor",
      "gender": "feminine",
      "tone": "Clear and well-paced adult female voice with a warm tone for customer service and professional…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "56df0456-8f47-4f7a-ac26-40c2f9797104",
      "name": "Pierre - Baritone Storyteller",
      "gender": "masculine",
      "tone": "Deep and resonant adult male voice for narration, audiobooks, and authoritative storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "fr",
      "sampleDir": "samples/cartesia-sonic-3-fr"
    },
    {
      "voiceId": "4590a461-bc68-4a50-8d14-ac04f5923d22",
      "name": "Isha - Learner",
      "gender": "feminine",
      "tone": "Youthful female voice with a clear and approachable tone for narration, educational content, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "gu",
      "sampleDir": "samples/cartesia-sonic-3-gu"
    },
    {
      "voiceId": "91925fe5-42ee-4ebe-96c1-c84b12a85a32",
      "name": "Amit - Sports Student",
      "gender": "masculine",
      "tone": "Friendly young adult male voice for casual conversations and natural everyday dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "gu",
      "sampleDir": "samples/cartesia-sonic-3-gu"
    },
    {
      "voiceId": "84b969ad-19c7-428d-b742-48d387f7f138",
      "name": "Gil - Friendly Host",
      "gender": "masculine",
      "tone": "Warm, genuine Hebrew male perfect for conversational experiences.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "he",
      "sampleDir": "samples/cartesia-sonic-3-he"
    },
    {
      "voiceId": "431b7e77-b46d-4eda-8362-db430ac0913c",
      "name": "Oren - Steady Advisor",
      "gender": "masculine",
      "tone": "Calm, measured Hebrew male suited for professional communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "he",
      "sampleDir": "samples/cartesia-sonic-3-he"
    },
    {
      "voiceId": "daa4d6bb-da62-4e16-8065-76cd87942475",
      "name": "Eitan - Modern Communicator",
      "gender": "masculine",
      "tone": "Strong Hebrew male providing a clear tone for corporate messaging.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "he",
      "sampleDir": "samples/cartesia-sonic-3-he"
    },
    {
      "voiceId": "2821fd0c-35c7-4adf-9c42-32e394bf85cb",
      "name": "Adi - Efficient Expert",
      "gender": "feminine",
      "tone": "Articulate, professional Hebrew female for customer assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "he",
      "sampleDir": "samples/cartesia-sonic-3-he"
    },
    {
      "voiceId": "1daba551-67af-465e-a189-f91495aa2347",
      "name": "Yael - Casual Presence",
      "gender": "feminine",
      "tone": "Voice with relaxed tone and friendly warmth, ideal for conversational dialogue and everyday…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "he",
      "sampleDir": "samples/cartesia-sonic-3-he"
    },
    {
      "voiceId": "3e32f3c5-9ac0-4192-9994-87fdb277120f",
      "name": "Noam - Broadcaster",
      "gender": "masculine",
      "tone": "Clear and authoritative adult male voice for announcements, broadcasts, and formal presentations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "he",
      "sampleDir": "samples/cartesia-sonic-3-he"
    },
    {
      "voiceId": "faf0731e-dfb9-4cfc-8119-259a79b27e12",
      "name": "Riya - College Roommate",
      "gender": "feminine",
      "tone": "Friendly woman for playful conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "95d51f79-c397-46f9-b49a-23763d3eaa2d",
      "name": "Arushi - Hinglish Speaker",
      "gender": "feminine",
      "tone": "Hinglish female for bilingual content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "bec003e2-3cb3-429c-8468-206a393c67ad",
      "name": "Parvati - Friendly Supporter",
      "gender": "feminine",
      "tone": "Friendly female for customer support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "4877b818-c7fe-4c89-b1cf-eadf8e23da72",
      "name": "Rohan - Steady Communicator",
      "gender": "masculine",
      "tone": "Clear, measured Hindi male suited for corporate communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "6b02ffe5-e3cb-48c0-a023-c72f85953375",
      "name": "Sneha - Empathetic Voice",
      "gender": "feminine",
      "tone": "Gentle and reassuring tone designed to offer comfort and build trust.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "098fb15d-2597-4186-8b74-25340050b6e7",
      "name": "Vishal\t- Assured Expert",
      "gender": "masculine",
      "tone": "Grounded, knowledgeable delivery for professional communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "910fb75e-1d20-4840-ac63-ac6b26a71bdc",
      "name": "Dev\t- Friendly Host",
      "gender": "masculine",
      "tone": "Warm, genuine Hindi male perfect for conversational platforms.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "0f14d8cb-f039-41fe-a813-a9b4bee7eed8",
      "name": "Nisha - Elegant Speaker",
      "gender": "feminine",
      "tone": "Refined, composed Hindi female perfect for formal announcements.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "a81fccdc-5595-4dfc-ae76-4de6a515b8a2",
      "name": "Meera - Bright Companion",
      "gender": "feminine",
      "tone": "Friendly, approachable Hindi female perfect for everyday interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "791d5162-d5eb-40f0-8189-f19db44611d8",
      "name": "Ayush - Friendly Neighbor",
      "gender": "masculine",
      "tone": "Confident, young Indian male for delivering demos and instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "56e35e2d-6eb6-4226-ab8b-9776515a7094",
      "name": "Kavita - Customer Care Agent",
      "gender": "feminine",
      "tone": "Mature Indian female for customer care use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "7e8cb11d-37af-476b-ab8f-25da99b18644",
      "name": "Anuj - Engaging Narrator",
      "gender": "masculine",
      "tone": "Expressive male voice for storytelling and conversational content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "47f3bbb1-e98f-4e0c-92c5-5f0325e1e206",
      "name": "Neha - Virtual Assistant",
      "gender": "feminine",
      "tone": "Clear, composed female voice for virtual assistants and system prompts",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "6303e5fb-a0a7-48f9-bb1a-dd42c216dc5d",
      "name": "Sagar - Helpful Friend",
      "gender": "masculine",
      "tone": "Energetic adult male for engaging customer support and conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "28ca2041-5dda-42df-8123-f58ea9c3da00",
      "name": "Palak - Presenter",
      "gender": "feminine",
      "tone": "Friendly female with a slight English accent for teaching use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "9cebb910-d4b7-4a4a-85a4-12c79137724c",
      "name": "Aarti - Conversationalist",
      "gender": "feminine",
      "tone": "Indian accented female for relatable dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "f91ab3e6-5071-4e15-b016-cde6f2bcd222",
      "name": "Aadhya - Soother",
      "gender": "feminine",
      "tone": "Slow female voice for casual conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "fd2ada67-c2d9-4afe-b474-6386b87d8fc3",
      "name": "Ishan - Ally",
      "gender": "masculine",
      "tone": "Conversational male for Hinglish sales and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "be79f378-47fe-4f9c-b92b-f02cefa62ccf",
      "name": "Sunil - Official Announcer",
      "gender": "masculine",
      "tone": "Deep male for serious conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "9b953e7b-86a8-42f0-b625-1434fb15392b",
      "name": "Neeraj - Tour Guide",
      "gender": "masculine",
      "tone": "Deep male for excellent storytelling and providing instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "bdab08ad-4137-4548-b9db-6142854c7525",
      "name": "Imran - Hindi Film Actor",
      "gender": "masculine",
      "tone": "Bollywood male artist for serious roles",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "7f423809-0011-4658-ba48-a411f5e516ba",
      "name": "Ashwin - Warm Narrator",
      "gender": "masculine",
      "tone": "Warm and authoritative Hindi male for narrating stories, audiobooks, and documentaries",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "432fc642-6a83-4975-b77a-c605903b5ba6",
      "name": "Sanya - Modern Communicator",
      "gender": "feminine",
      "tone": "Crisp, approachable Hindi female built for digital assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "20e68f5c-08e5-42d0-8e9b-6e716fd1ae66",
      "name": "Vivek - Composed Voice",
      "gender": "masculine",
      "tone": "Low-pitched, grounded male voice for formal communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "6b7468f5-d6b0-4d6b-b38a-46f6d6e5bac7",
      "name": "Rakesh - Thoughtful Speaker",
      "gender": "masculine",
      "tone": "Expressive male voice for informative narration and explanations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "adf97b9d-905c-41de-9fe9-afb387116d06",
      "name": "Vikas - Approachable Voice",
      "gender": "masculine",
      "tone": "Polite, friendly male voice for customer support and service conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "55e2a153-c61e-4784-85c8-e954cb22fe29",
      "name": "Sanjay - Clear Speaker",
      "gender": "masculine",
      "tone": "Formal male voice with clear pronunciation for professional narration and announcements",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "393dd459-f8d8-4c3e-a86b-ec43a1113d0b",
      "name": "Rahul - Calm Office Guy",
      "gender": "masculine",
      "tone": "Approachable adult male voice for casual conversations and everyday interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "209d9a43-03eb-40d8-a7b7-51a6d54c052f",
      "name": "Anita - Meditation Guide",
      "gender": "feminine",
      "tone": "Soft-spoken adult female voice for casual conversations, meditation, and calming dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hi",
      "sampleDir": "samples/cartesia-sonic-3-hi"
    },
    {
      "voiceId": "a1a16724-b1f3-4b27-9e47-8a175115e93c",
      "name": "Ivan - Bar Companion",
      "gender": "masculine",
      "tone": "Relaxed adult male voice for easygoing conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hr",
      "sampleDir": "samples/cartesia-sonic-3-hr"
    },
    {
      "voiceId": "2a2624ad-bd06-4563-81fd-0519742e25d2",
      "name": "Petra - Strict Lecturer",
      "gender": "feminine",
      "tone": "Firm and strict adult female voice for storytelling, guidance, and instructional use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hr",
      "sampleDir": "samples/cartesia-sonic-3-hr"
    },
    {
      "voiceId": "4c5c7be8-6b3b-4c62-b915-c54d049c198f",
      "name": "Bence - Focused Facilitator",
      "gender": "masculine",
      "tone": "Professional adult male for highly structured communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hu",
      "sampleDir": "samples/cartesia-sonic-3-hu"
    },
    {
      "voiceId": "e97c3b37-1aa5-46af-afb7-9545086aaa92",
      "name": "Eszter - Customer Companion",
      "gender": "feminine",
      "tone": "Clear and cheerful adult female voice for customer support and friendly interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hu",
      "sampleDir": "samples/cartesia-sonic-3-hu"
    },
    {
      "voiceId": "36e0c00b-1bfd-4ad7-a0e8-928d4cadca00",
      "name": "Gabor - Reassuring Voice",
      "gender": "masculine",
      "tone": "Firm and well-paced adult male voice for customer support, guidance, and professional communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "hu",
      "sampleDir": "samples/cartesia-sonic-3-hu"
    },
    {
      "voiceId": "a053f6bc-7df4-40de-96d4-de026bc47ce8",
      "name": "Andi - Dynamic Presenter",
      "gender": "masculine",
      "tone": "Expressive adult male voice with an upbeat tone for advertisements, promotions, and lively…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "id",
      "sampleDir": "samples/cartesia-sonic-3-id"
    },
    {
      "voiceId": "b441c4fd-4910-4c55-ae56-f0291057e2cc",
      "name": "Siti - Ad Narrator",
      "gender": "feminine",
      "tone": "Cheerful and optimistic adult female voice for brand placements, advertisements, and engaging…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "id",
      "sampleDir": "samples/cartesia-sonic-3-id"
    },
    {
      "voiceId": "ee16f140-f6dc-490e-a1ed-c1d537ea0086",
      "name": "Lorenzo - Hospitable Host",
      "gender": "masculine",
      "tone": "Approachable Italian adult male for natural, everyday communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "d718e944-b313-4998-b011-d1cc078d4ef3",
      "name": "Liv - Casual Friend",
      "gender": "feminine",
      "tone": "Casual female for natural conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "e5923af7-a329-4e9b-b95a-5ace4a083535",
      "name": "Lucio - Empath",
      "gender": "masculine",
      "tone": "Charismatic and engaging male for expressive dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "408daed0-c597-4c27-aae8-fa0497d644bf",
      "name": "Matteo - Gentle Narrator",
      "gender": "masculine",
      "tone": "Reassuring male for soothing dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "e019ed7e-6079-4467-bc7f-b599a5dccf6f",
      "name": "Luca - Everyday Friend",
      "gender": "masculine",
      "tone": "Casual male for natural conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "79693aee-1207-4771-a01e-20c393c89e6f",
      "name": "Marco - Friendly Conversationalist",
      "gender": "masculine",
      "tone": "Friendly and professional male for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "d609f27f-f1a4-410f-85bb-10037b4fba99",
      "name": "Francesca - Elegant Partner",
      "gender": "feminine",
      "tone": "Enunciating female for natural conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "0e21713a-5e9a-428a-bed4-90d410b87f13",
      "name": "Alessandra - Melodic Guide",
      "gender": "feminine",
      "tone": "Graceful female for providing instructions and guidance",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "029c3c7a-b6d9-44f0-814b-200d849830ff",
      "name": "Giancarlo - Support Leader",
      "gender": "masculine",
      "tone": "Deep male for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "90c7d657-9599-4cd0-9ed2-2568359e4d1a",
      "name": "Sofia - Methodical Moderator",
      "gender": "feminine",
      "tone": "Polished adult female for efficient transactional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "88b329db-85d7-47cc-a5c5-98225a756721",
      "name": "Giuseppe - Retro Man",
      "gender": "masculine",
      "tone": "Vintage-style adult male voice with a nostalgic old-radio tone for historical reenactments,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "36d94908-c5b9-4014-b521-e69aee5bead0",
      "name": "Giulia - Teacherly Voice",
      "gender": "feminine",
      "tone": "Firm and clear adult female voice for lectures, guidance, and authoritative storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "it",
      "sampleDir": "samples/cartesia-sonic-3-it"
    },
    {
      "voiceId": "2b568345-1d48-4047-b25f-7baccf842eb0",
      "name": "Yumiko - Friendly Agent",
      "gender": "feminine",
      "tone": "Friendly, professional and upbeat woman for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "e8a863c6-22c7-4671-86ca-91cacffc038d",
      "name": "Daisuke - Businessman",
      "gender": "masculine",
      "tone": "Business-like, clear male for professional use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "177df681-25b1-48c2-bb47-03ca5fa27f0a",
      "name": "Ren\t- Calm Navigator",
      "gender": "masculine",
      "tone": "Calm Japanese male suited for professional and reassuring communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "1d210168-d764-462c-8ab6-288a6d5a9579",
      "name": "Hiroshi - Dependable Director",
      "gender": "masculine",
      "tone": "Steady Japanese male for clear transactional support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "d0ff6870-dd30-420d-8568-d756d806ea62",
      "name": "Hinata\t- Graceful Guide",
      "gender": "feminine",
      "tone": "Polished Japanese female for polite, reassuring assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "498e7f37-7fa3-4e2c-b8e2-8b6e9276f956",
      "name": "Aiko - Calming Voice",
      "gender": "feminine",
      "tone": "Calm and composed voice for clear, conversational interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "59d4fd2f-f5eb-4410-8105-58db7661144f",
      "name": "Yuki - Calm Woman",
      "gender": "feminine",
      "tone": "Calm, more serious female for news narration and formal customer service",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "0cd0cde2-3b93-42b5-bcb9-f214a591aa29",
      "name": "Sayuri - Peppy Colleague",
      "gender": "feminine",
      "tone": "Clear and bright female with a gentle tone of politeness and a naturally inquisitive cadence for…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "c7eafe22-8b71-40cd-850b-c5a3bbd8f8d2",
      "name": "Emi - Soft-Spoken Friend",
      "gender": "feminine",
      "tone": "Soft and delicate female with a gentle, timid tone for female game characters and children's…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "6b92f628-be90-497c-8f4c-3b035002df71",
      "name": "Kenji - Calm Man",
      "gender": "masculine",
      "tone": "Calm, deep male for news narration and formal customer service",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "06950fa3-534d-46b3-93bb-f852770ea0b5",
      "name": "Takeshi - Hero",
      "gender": "masculine",
      "tone": "Smooth, expressive male with a warm mid-range and dynamic emotional range for dramatic storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "446f922f-c43a-4aad-9a8b-ad2af568e882",
      "name": "Akira - Professional Colleague",
      "gender": "masculine",
      "tone": "Clear and professional male for news announcements and business conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "9e7ef2cf-b69c-46ac-9e35-bbfd73ba82af",
      "name": "Ren - High-Energy Character",
      "gender": "masculine",
      "tone": "Bold and lively male with high energy for fictional characters, dynamic narration, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "a759ecc5-ac21-487e-88c7-288bdfe76999",
      "name": "Daichi - Baritone Narrator",
      "gender": "masculine",
      "tone": "Low pitched, intense male with a mysterious and brooding tone for villains, anti-heroes, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "44863732-e415-4084-8ba1-deabe34ce3d2",
      "name": "Kaori - Friendly Narrator",
      "gender": "feminine",
      "tone": "Upbeat, positive, and gentle female for commercials and audiobooks",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "97e7d7a9-dfaa-4758-a936-f5f844ac34cc",
      "name": "Fuji - Positive Colleague",
      "gender": "masculine",
      "tone": "Positive and gentle male for conversational settings",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "861213b7-f057-45c8-9527-0f4c144f1a03",
      "name": "Haruka - Gracious Guide",
      "gender": "feminine",
      "tone": "Clear, polite Japanese female for welcoming customer assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "63d6f469-8c2c-489d-b53f-d36f0bbdcd4b",
      "name": "Ayako",
      "gender": "feminine",
      "tone": "Friendly and calm adult female for providing instructions and conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "9436e723-612d-4114-aeb0-fa00d4d639bf",
      "name": "Katsuya - Promo Host",
      "gender": "masculine",
      "tone": "Lively confident male for advertising and announcing",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "49e02441-83ea-4c77-bda8-79fdd7f07e92",
      "name": "Tohru - Career Coach",
      "gender": "masculine",
      "tone": "Young professional male for providing guidance and instruction",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "31c55968-a9f4-4115-8831-3a16952179c8",
      "name": "Ayumi - Sales Guide",
      "gender": "feminine",
      "tone": "Upbeat and enthusiastic adult female voice for sales, promotions, and engaging customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "b8e1169c-f16a-4064-a6e0-95054169e553",
      "name": "Takashi - Professional Conversationalist",
      "gender": "masculine",
      "tone": "Serious adult male voice with a steady but approachable tone for casual conversations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ja",
      "sampleDir": "samples/cartesia-sonic-3-ja"
    },
    {
      "voiceId": "dbebd077-80cb-4bcf-b43b-4552f96341bb",
      "name": "Levan - Support Guide",
      "gender": "masculine",
      "tone": "Casual and approachable adult male voice for customer support and everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ka",
      "sampleDir": "samples/cartesia-sonic-3-ka"
    },
    {
      "voiceId": "0bfbea6c-2f8f-4f86-b411-aa2316561e36",
      "name": "Tamara - Support Specialist",
      "gender": "feminine",
      "tone": "Professional and clear adult female voice for customer service, guidance, and supportive…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ka",
      "sampleDir": "samples/cartesia-sonic-3-ka"
    },
    {
      "voiceId": "7c6219d2-e8d2-462c-89d8-7ecba7c75d65",
      "name": "Divya - Joyful Narrator",
      "gender": "feminine",
      "tone": "Lively and cheerful adult female voice for product advertisements, upbeat promotions, and happy…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "kn",
      "sampleDir": "samples/cartesia-sonic-3-kn"
    },
    {
      "voiceId": "6baae46d-1226-45b5-a976-c7f9b797aae2",
      "name": "Prakash - Instructor",
      "gender": "masculine",
      "tone": "Firm and articulate middle-aged male voice for lectures, presentations, and instructional content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "kn",
      "sampleDir": "samples/cartesia-sonic-3-kn"
    },
    {
      "voiceId": "4dd4630e-19e0-4243-bca0-676ff85119b7",
      "name": "Haeun - Polished Presence",
      "gender": "feminine",
      "tone": "Refined and smooth articulation for high-quality corporate messaging.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "e1717dc3-b87b-4720-aa7f-b6db290e0609",
      "name": "Taehyun - Friendly Host",
      "gender": "masculine",
      "tone": "Warm, genuine Korean for podcasts and conversational platforms.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "89f4372f-1f73-4b85-8e1e-5d24ed8bc826",
      "name": "Jaewon - Steady Advisor",
      "gender": "masculine",
      "tone": "Calm, measured Korean male suited for professional communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "304fdbd8-65e6-40d6-ab78-f9d18b9efdf9",
      "name": "Jihyun - Anchorwoman",
      "gender": "feminine",
      "tone": "Relaxing female for narrations and announcements",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "af6beeea-d732-40b6-8292-73af0035b740",
      "name": "Byungtae - Enforcer",
      "gender": "masculine",
      "tone": "Authoritative male for providing instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "ce9ca2b6-2bed-4452-99bb-052e1ec0b534",
      "name": "Seoyun - Warm Guide",
      "gender": "feminine",
      "tone": "Inviting and approachable tone perfect for providing friendly guidance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "a0fc16d3-01af-482b-910f-ed063c3d79d3",
      "name": "Subin - Elegant Speaker",
      "gender": "feminine",
      "tone": "Refined, composed Korean female suited for formal announcements.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "7706804e-ea85-443a-968a-b9bf363bdde8",
      "name": "Minji - Modern Communicator",
      "gender": "feminine",
      "tone": "Crisp, natural Korean female built for platforms and digital assistants.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "69c18e1d-fab0-4747-b9da-58617cd8b9e4",
      "name": "Soyeon - Bright Companion",
      "gender": "feminine",
      "tone": "Confident, friendly Korean female suited for conversation.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "90dba946-774b-40ed-98d9-ac3835117827",
      "name": "Hyerin\t- Graceful Host",
      "gender": "feminine",
      "tone": "Warm, welcoming Korean female that puts listeners at ease instantly.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "15628352-2ede-4f1b-89e6-ceda0c983fbc",
      "name": "Jiwoo - Service Specialist",
      "gender": "feminine",
      "tone": "Professional and polite adult female voice for customer service, support, and clear communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "29e5f8b4-b953-4160-848f-40fae182235b",
      "name": "Mimi - Show Stopper",
      "gender": "feminine",
      "tone": "Cheery, young female for entertainment and content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "663afeec-d082-4ab5-827e-2e41bf73a25b",
      "name": "Jaechul - Disciplined Woman",
      "gender": "feminine",
      "tone": "Serious female for formal conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "537a82ae-4926-4bfb-9aec-aff0b80a12a5",
      "name": "Minho - Friendly Spirit",
      "gender": "masculine",
      "tone": "Laidback voice with a smooth, approachable tone that feels friendly and natural in conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "f7755efb-1848-4321-aa22-5e5be5d32486",
      "name": "Ryeowook - Easygoing Pal",
      "gender": "masculine",
      "tone": "Relaxed voice with calm, natural pacing, ideal for easygoing everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "cd6c48a9-774b-4397-98b4-9948c0a790f0",
      "name": "Soojin - Helpful Tone",
      "gender": "feminine",
      "tone": "Casual voice with a natural, friendly tone that feels relaxed and approachable in conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "cac92886-4b7c-4bc1-a524-e0f79c0381be",
      "name": "Yuna - Kind Unnie",
      "gender": "feminine",
      "tone": "Cheerful voice with a bright yet gentle tone, perfect for empathetic and friendly customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ko",
      "sampleDir": "samples/cartesia-sonic-3-ko"
    },
    {
      "voiceId": "374b80da-e622-4dfc-90f6-1eeb13d331c9",
      "name": "Vijay - Comfort Voice",
      "gender": "masculine",
      "tone": "Friendly and easygoing male voice for casual conversations and everyday support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ml",
      "sampleDir": "samples/cartesia-sonic-3-ml"
    },
    {
      "voiceId": "b426013c-002b-4e89-8874-8cd20b68373a",
      "name": "Latha - Friendly Host",
      "gender": "feminine",
      "tone": "Bright and clear adult female voice for customer support, greetings, and welcoming guests",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ml",
      "sampleDir": "samples/cartesia-sonic-3-ml"
    },
    {
      "voiceId": "f227bc18-3704-47fe-b759-8c78a450fdfa",
      "name": "Suresh - Instruction Voice",
      "gender": "masculine",
      "tone": "Clear and well-enunciated adult male voice for instructions, narrations, and professional…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "mr",
      "sampleDir": "samples/cartesia-sonic-3-mr"
    },
    {
      "voiceId": "5c32dce6-936a-4892-b131-bafe474afe5f",
      "name": "Anika - Enthusiastic Seller",
      "gender": "feminine",
      "tone": "Energetic and approachable adult female voice for sales conversations, casual chat, and customer…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "mr",
      "sampleDir": "samples/cartesia-sonic-3-mr"
    },
    {
      "voiceId": "8281db18-6ac5-47bb-91a8-ce23a1f1d951",
      "name": "Faiz - Family Guide",
      "gender": "masculine",
      "tone": "Warm and fatherly adult male voice for casual conversations and comforting dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ms",
      "sampleDir": "samples/cartesia-sonic-3-ms"
    },
    {
      "voiceId": "83604597-55fa-4ccc-8357-730b313f353f",
      "name": "Aisyah - Chat Partner",
      "gender": "feminine",
      "tone": "Friendly and upbeat adult female voice for casual conversations and engaging everyday dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ms",
      "sampleDir": "samples/cartesia-sonic-3-ms"
    },
    {
      "voiceId": "da743a82-ddf2-4d9b-8eb8-ff67ca0b138e",
      "name": "Stjin - Helpful Handler",
      "gender": "masculine",
      "tone": "Approachable Dutch male for professional dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "95e9fdaf-cf0b-4739-b1de-3350ca50774a",
      "name": "Thijs - Confident Coordinator",
      "gender": "masculine",
      "tone": "Clear, methodical Dutch male for reassuring professional dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "96355f3d-0179-4c9a-a8d8-11ef0779a9b8",
      "name": "Noa - Reassuring Responder",
      "gender": "feminine",
      "tone": "Soft, clear Dutch female for empathetic customer communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "de075c71-b2dd-4723-848d-ea9aa9cd010b",
      "name": "Fleur - Vibrant Voice",
      "gender": "feminine",
      "tone": "Youthful, spirited Dutch female for friendly professional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "225ba8cf-9fc2-4371-a78c-fe38ba38898a",
      "name": "Anneliese - Methodical Guide",
      "gender": "feminine",
      "tone": "Clear, articulate Dutch female for efficient professional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "9e8db62d-056f-47f3-b3b6-1b05767f9176",
      "name": "Daan - Business Baritone",
      "gender": "masculine",
      "tone": "Authoritative male for presentations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "4aa74047-d005-4463-ba2e-a0d9b261fb87",
      "name": "Bram - Instructional Voice",
      "gender": "masculine",
      "tone": "Clear male for tutorials and explainer videos",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "0eb213fe-4658-45bc-9442-33a48b24b133",
      "name": "Sanne - Clear Companion",
      "gender": "feminine",
      "tone": "Cheerful female for engaging conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "af482421-80f4-4379-b00c-a118def29cde",
      "name": "Lucas - Storyteller",
      "gender": "masculine",
      "tone": "Enunciating male for storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "60e94cf5-8069-459f-a91e-3ff852a51107",
      "name": "Isa - Empathetic Ear",
      "gender": "feminine",
      "tone": "Warm, expressive Dutch female for supportive customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "ac317dac-1b8f-434f-b198-a490e2a4914d",
      "name": "Anneke - Trusted Guide",
      "gender": "feminine",
      "tone": "Soft-spoken adult female voice with a warm and caring tone for supportive conversations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "4b250449-c635-4b63-bd1d-b654b12ffcd4",
      "name": "Jeroen - Clear Storyteller",
      "gender": "masculine",
      "tone": "Clear and firm adult male voice for scientific reporting, documentaries, and professional…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "nl",
      "sampleDir": "samples/cartesia-sonic-3-nl"
    },
    {
      "voiceId": "4f7b1820-6263-4615-87a7-b105768d8f64",
      "name": "Kari - Crisp Coordinator",
      "gender": "feminine",
      "tone": "Polished Norwegian voice for efficient transactional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "no",
      "sampleDir": "samples/cartesia-sonic-3-no"
    },
    {
      "voiceId": "d6dca1b6-cdd8-4e9c-823c-e03979261740",
      "name": "Lars - Casual Conversationalist",
      "gender": "masculine",
      "tone": "Approachable adult male voice with a relaxed tone for casual conversations and everyday interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "no",
      "sampleDir": "samples/cartesia-sonic-3-no"
    },
    {
      "voiceId": "991c62ce-631f-48b0-8060-2a0ebecbd15b",
      "name": "Jaspreet - Commercial Woman",
      "gender": "feminine",
      "tone": "Expressive adult female voice with an engaging tone for commercials, promotions, and lively…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pa",
      "sampleDir": "samples/cartesia-sonic-3-pa"
    },
    {
      "voiceId": "8bacd442-a107-4ec1-b6f1-2fcb3f6f4d56",
      "name": "Gurpreet - Companion",
      "gender": "masculine",
      "tone": "Soft and caring adult male voice for empathetic conversations, support, and reassuring dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pa",
      "sampleDir": "samples/cartesia-sonic-3-pa"
    },
    {
      "voiceId": "d358377a-cd1d-45c5-abd0-701314e36cbe",
      "name": "Marcin - Charismatic Presenter",
      "gender": "masculine",
      "tone": "Bright, energetic Polish male that brings scripts to life.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "43e52207-96fc-4e01-aaf8-cae317e43fdb",
      "name": "Kacper - Diligent Detailer",
      "gender": "masculine",
      "tone": "Methodical Polish male for precise and efficient support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "82a7fc13-2927-4e42-9b8a-bb1f9e506521",
      "name": "Tomek - Casual Companion",
      "gender": "masculine",
      "tone": "Energetic male for casual conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "4ef93bb3-682a-46e6-b881-8e157b6b4388",
      "name": "Wojciech - Documentarian",
      "gender": "masculine",
      "tone": "Deep male for narrations and documentary media",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "dcf62f33-7cff-4f20-85b2-2efaa68cbc32",
      "name": "Zofia - Audiobook Muse",
      "gender": "feminine",
      "tone": "Expressive female for clear communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "575a5d29-1fdc-4d4e-9afa-5a9a71759864",
      "name": "Katarzyna - Melodic Storyteller",
      "gender": "feminine",
      "tone": "Melodic female for storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "3d335974-4c4a-400a-84dc-ebf4b73aada6",
      "name": "Piotr - Corporate Lead",
      "gender": "masculine",
      "tone": "Confident male for providing instructions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "2a3503b2-b6b6-4534-a224-e8c0679cec4a",
      "name": "Jakub - Gentle Guide",
      "gender": "masculine",
      "tone": "Clear male for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "f8aacd6e-1ac2-42d3-bcbf-125336ecd0f2",
      "name": "Ewa\t- Efficient Envoy",
      "gender": "feminine",
      "tone": "Professional Polish female for efficient, everyday dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "6bc7c014-022b-42ce-8b53-a5ec878a7ca7",
      "name": "Agnieszka - Coordinator",
      "gender": "feminine",
      "tone": "Formal adult female for direct and capable assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "887149a8-4616-42ad-b2ce-c3819176f45d",
      "name": "Andrzej - Elder Voice",
      "gender": "masculine",
      "tone": "Wise-sounding elderly male voice with a calm and casual tone for storytelling, guidance, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "ea7b5eee-39d9-40b0-b241-1910cbca9c62",
      "name": "Kasia - Natural Conversationalist",
      "gender": "feminine",
      "tone": "Approachable adult female voice with a natural and casual tone for everyday conversations and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pl",
      "sampleDir": "samples/cartesia-sonic-3-pl"
    },
    {
      "voiceId": "b603811e-54c2-4a0a-8854-09eab9ffa63f",
      "name": "Bruno - Reliable Communicator",
      "gender": "masculine",
      "tone": "Clear, dependable Brazilian male built for corporate communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "07b6f895-78b9-4921-8e10-8a21c99c2e8a",
      "name": "Rafael - Dynamic Speaker",
      "gender": "masculine",
      "tone": "Engaging, charismatic Brazilian male that captures attention for media.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "8d826d43-20ad-4c56-8d37-1048eccca1bf",
      "name": "Larissa - Bright Companion",
      "gender": "feminine",
      "tone": "Friendly, approachable Brazilian female for everyday interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "c9611be8-aae9-4a93-bb1c-98dd6b7d52a4",
      "name": "Isabella - Warm Storyteller",
      "gender": "feminine",
      "tone": "Rich, expressive Brazilian female perfect for narration.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "b0f46533-d4bb-493f-a26f-a99e1f2e86e3",
      "name": "Heitor - Easygoing Local",
      "gender": "masculine",
      "tone": "Warm, relatable young adult male with a down-to-earth countryside charm",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "6a360542-a117-4ed5-9e09-e8bf9b05eabb",
      "name": "Tiago - Narration Expert",
      "gender": "masculine",
      "tone": "Calm, clear male for narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "d4b44b9a-82bc-4b65-b456-763fce4c52f9",
      "name": "Beatriz - Support Guide",
      "gender": "feminine",
      "tone": "Friendly, natural female for engaging conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "700d1ee3-a641-4018-ba6e-899dcadc9e2b",
      "name": "Luana - Public Speaker",
      "gender": "feminine",
      "tone": "Pleasant, clear female for casual conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "1cf751f6-8749-43ab-98bd-230dd633abdb",
      "name": "Ana Paula - Marketer",
      "gender": "feminine",
      "tone": "Warm, friendly female for natural, informal dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "5063f45b-d9e0-4095-b056-8f3ee055d411",
      "name": "Camilo - Supporter",
      "gender": "masculine",
      "tone": "Soothing, warm male for feel good conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "a37639f0-2f0a-4de4-9942-875a187af878",
      "name": "Felipe - Casual Talker",
      "gender": "masculine",
      "tone": "Relaxed, conversational male for reassuring conversation",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "6a16c1f4-462b-44de-998d-ccdaa4125a0a",
      "name": "Hidalgo - Anchorperson",
      "gender": "masculine",
      "tone": "Lively, confident male for announcements",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "28a942b5-74f3-47bb-9b56-4c3f2562d3ba",
      "name": "Gustavo - Steady Advisor",
      "gender": "masculine",
      "tone": "Calm, measured Brazilian male suited for professional communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "2f4d204f-a5dc-4196-81bc-155986b76ab6",
      "name": "Mirella - Upbeat Speaker",
      "gender": "feminine",
      "tone": "Bright, youthful female voice for friendly, everyday dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "f39bf583-3b3d-402f-9ffb-6179d9ec3e35",
      "name": "Isabel - Confident Woman",
      "gender": "feminine",
      "tone": "Confident, clear, and firm adult female voice for giving instructions, guidance, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "fbee0e7d-a83a-4082-bad1-13c70f86da4e",
      "name": "Diogo - Promotion Lead",
      "gender": "masculine",
      "tone": "Strong and expressive adult male voice for narrations, commercials, and persuasive communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "pt",
      "sampleDir": "samples/cartesia-sonic-3-pt"
    },
    {
      "voiceId": "34acfaee-c556-41ee-a5f6-c687fb20357c",
      "name": "Andrada - Steady Speaker",
      "gender": "feminine",
      "tone": "Clear and monotone adult female voice for instructions formal announcements, and straightforward…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ro",
      "sampleDir": "samples/cartesia-sonic-3-ro"
    },
    {
      "voiceId": "3f64ef99-d87b-4b51-b217-df7351f7886a",
      "name": "Andrei - Conversationalist Guy",
      "gender": "masculine",
      "tone": "Casual yet firm middle-aged male voice for everyday conversations, guidance, and professional…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ro",
      "sampleDir": "samples/cartesia-sonic-3-ro"
    },
    {
      "voiceId": "1e4176b1-3db9-44d6-a601-4fe68b041942",
      "name": "Sergei - Steady Supporter",
      "gender": "masculine",
      "tone": "Reliable Russian male for clear, efficient dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "064b17af-d36b-4bfb-b003-be07dba1b649",
      "name": "Tatiana - Friendly Storyteller",
      "gender": "feminine",
      "tone": "Friendly female for audiobooks and clear communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "642014de-c0e3-4133-adc0-36b5309c23e6",
      "name": "Irina - Poetic Voice",
      "gender": "feminine",
      "tone": "Graceful female for narrations and audiobooks",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "779673f3-895f-4935-b6b5-b031dc78b319",
      "name": "Natalya - Soothing Guide",
      "gender": "feminine",
      "tone": "Serene female for relaxing audio",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "7a62541e-5492-410e-95ff-3abd096fce87",
      "name": "Natalia - Steady Strategist",
      "gender": "feminine",
      "tone": "Measured Russian female for highly structured communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "25b7aaa6-1670-42dc-b791-419322400803",
      "name": "Daria - Decisive Dispatcher",
      "gender": "feminine",
      "tone": "Confident adult female for direct and capable assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "069ff31a-5524-4945-a403-f746ee617507",
      "name": "Alexei\t- Articulate Analyst",
      "gender": "masculine",
      "tone": "Polished Russian voice for capable transactional assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "9ed9f7e7-3ef6-4773-9dd3-ffcb479ca1f0",
      "name": "Olga - Confident Saleswoman",
      "gender": "feminine",
      "tone": "Upbeat and confident adult female voice for presentations and engaging customer interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "888b7df4-e165-4852-bfec-0ab2b96aaa46",
      "name": "Dmitri - Gentle Voice",
      "gender": "masculine",
      "tone": "Approachable adult male voice with a relaxed tone for casual chats and everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ru",
      "sampleDir": "samples/cartesia-sonic-3-ru"
    },
    {
      "voiceId": "ca590fdc-df56-4d2e-94a4-ef5b423c7ddf",
      "name": "Peter - Narrator Man",
      "gender": "masculine",
      "tone": "Steady and articulate adult male voice for narrations, audiobooks, and professional storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sk",
      "sampleDir": "samples/cartesia-sonic-3-sk"
    },
    {
      "voiceId": "abf68668-6549-462c-8426-1fa7b466b91d",
      "name": "Katarina - Friendly Sales",
      "gender": "feminine",
      "tone": "Warm and approachable adult female voice for customer service, support, and friendly communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sk",
      "sampleDir": "samples/cartesia-sonic-3-sk"
    },
    {
      "voiceId": "8c889eba-5b31-4179-8fb2-37bbee22db64",
      "name": "Nils - Friendly Host",
      "gender": "masculine",
      "tone": "Warm, genuine Swedish male for podcasts and conversational platforms.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "eede54e1-c038-4b4d-b655-809eeaa45c4c",
      "name": "Henrik - Refined Narrator",
      "gender": "masculine",
      "tone": "Smooth, polished Swedish male suited for premium content.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "f852eb8d-a177-48cd-bf63-7e4dcab61a36",
      "name": "Ingrid - Peaceful Guide",
      "gender": "feminine",
      "tone": "Serene female for relaxing narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "6c6b05bf-ae5f-4013-82ab-7348e99ffdb2",
      "name": "Freja - Nordic Reader",
      "gender": "feminine",
      "tone": "Expressive female for clear communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "38a146c3-69d7-40ad-aada-76d5a2621758",
      "name": "Anders - Nordic Baritone",
      "gender": "masculine",
      "tone": "Deep male for historical narrations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "0caedb75-417f-4e36-9b64-c21354cb94c8",
      "name": "Cees - Nordic Narrator",
      "gender": "masculine",
      "tone": "Enunciating male for smooth conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "b576c504-cbd1-4224-af06-04067c5a5e3e",
      "name": "Astrid - Direct Director",
      "gender": "feminine",
      "tone": "Polished Swedish female for efficient corporate assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "32a806e8-894e-41ad-a4d5-6d9154d7b1e6",
      "name": "Erik - Social Speaker",
      "gender": "masculine",
      "tone": "Relaxed and approachable adult male voice for casual conversations and natural everyday dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "00510a15-4216-4fdc-a0ab-05d74cd9f795",
      "name": "Elina - Clear Presenter Woman",
      "gender": "feminine",
      "tone": "Firm and professional adult female voice for news delivery, announcements, and formal presentations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "sv",
      "sampleDir": "samples/cartesia-sonic-3-sv"
    },
    {
      "voiceId": "80e4e2b3-ec54-4930-97ac-667eba950352",
      "name": "Nithya - Polished Presence",
      "gender": "feminine",
      "tone": "Refined and smooth articulation suited for corporate messaging.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ta",
      "sampleDir": "samples/cartesia-sonic-3-ta"
    },
    {
      "voiceId": "d4470f50-295e-4e11-82a2-158d45bf6abc",
      "name": "Anitha - Warm Guide",
      "gender": "feminine",
      "tone": "Inviting and approachable tone perfect for providing friendly guidance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ta",
      "sampleDir": "samples/cartesia-sonic-3-ta"
    },
    {
      "voiceId": "4014f0c9-d3eb-4eca-af2b-fd6004f526be",
      "name": "Meena - Measured Professional",
      "gender": "feminine",
      "tone": "Steady and even pacing that offers a grounding presence for any script.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ta",
      "sampleDir": "samples/cartesia-sonic-3-ta"
    },
    {
      "voiceId": "01d7796d-ac10-4ea3-8df0-3cc04f2d25ff",
      "name": "Kavitha - Clear Communicator",
      "gender": "feminine",
      "tone": "Crisp and articulate delivery designed for seamless information sharing.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ta",
      "sampleDir": "samples/cartesia-sonic-3-ta"
    },
    {
      "voiceId": "25d2c432-139c-4035-bfd6-9baaabcdd006",
      "name": "Kavya - Warm Presence",
      "gender": "feminine",
      "tone": "Friendly voice with natural tone and smooth flow, ideal for everyday conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ta",
      "sampleDir": "samples/cartesia-sonic-3-ta"
    },
    {
      "voiceId": "d2870b91-1b4c-47ab-81a8-3718d8e9c222",
      "name": "Arun - Lively Voice",
      "gender": "masculine",
      "tone": "Expressive adult voice with a lively tone for storytelling, narrations, and engaging cultural…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ta",
      "sampleDir": "samples/cartesia-sonic-3-ta"
    },
    {
      "voiceId": "7f98e662-142d-41ba-89a2-12452640ce6d",
      "name": "Lakshmi - Everyday Voice",
      "gender": "feminine",
      "tone": "Casual and upbeat adult female voice for friendly conversations, everyday dialogue, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "ta",
      "sampleDir": "samples/cartesia-sonic-3-ta"
    },
    {
      "voiceId": "4418bb06-8329-49a1-bb11-53bb64ca0547",
      "name": "Shanti - Calm Authority",
      "gender": "feminine",
      "tone": "Grounded and soothing voice that conveys confidence.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "3a8e6fea-81e5-4d4d-8755-86093146cdb8",
      "name": "Vidya - Empathetic Voice",
      "gender": "feminine",
      "tone": "Gentle and reassuring tone designed to offer comfort and build trust.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "76961778-5ce4-4aa9-9cdf-66a029d61a8f",
      "name": "Bhavani - Reassuring Companion",
      "gender": "feminine",
      "tone": "Soft and understanding tone for conveying genuine care and empathy.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "cf061d8b-a752-4865-81a2-57570a6e0565",
      "name": "Ramya - Graceful Host",
      "gender": "feminine",
      "tone": "Warm, welcoming Telugu female that puts listeners at ease instantly.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "07bc462a-c644-49f1-baf7-82d5599131be",
      "name": "Sindhu - Conversational Partner",
      "gender": "feminine",
      "tone": "Clear and natural adult female voice for casual conversations and everyday interactions",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "ebecd063-10f4-422e-a8ff-556ce5c4d4e4",
      "name": "Pavan - Bright Voice",
      "gender": "masculine",
      "tone": "Voice with energetic clarity and upbeat tone, ideal for customer support and engaging communication",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "330c4fa0-1da3-4c55-8e97-951bfd724e20",
      "name": "Sarika - Calm Spirit",
      "gender": "feminine",
      "tone": "Voice with laidback tone and gentle rhythm, perfect for relaxed, friendly, and conversational…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "38bded0a-3ab4-42d1-8e47-2e0b6b10ced9",
      "name": "Vikram - Folk Narrator",
      "gender": "masculine",
      "tone": "Expressive adult male voice with a colorful tone for storytelling, narrations, and engaging…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "te",
      "sampleDir": "samples/cartesia-sonic-3-te"
    },
    {
      "voiceId": "5de076e9-7b28-4442-b279-e7d80d573505",
      "name": "Somchai - Star",
      "gender": "masculine",
      "tone": "Upbeat and confident adult male voice for commercials, brand promotions, and lively presentations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "th",
      "sampleDir": "samples/cartesia-sonic-3-th"
    },
    {
      "voiceId": "ccc7bb22-dcd0-42e4-822e-0731b950972f",
      "name": "Suda - Fortune Teller",
      "gender": "feminine",
      "tone": "Expressive adult female voice with lively pronunciation for storytelling, advertisements, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "th",
      "sampleDir": "samples/cartesia-sonic-3-th"
    },
    {
      "voiceId": "aaa0bf6d-bc07-40f2-bc6b-66afc5fd42f6",
      "name": "Chakrit - Reliable Communicator",
      "gender": "masculine",
      "tone": "Clear, dependable Thai male built for public communications.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "th",
      "sampleDir": "samples/cartesia-sonic-3-th"
    },
    {
      "voiceId": "a50a04b8-35ee-487e-8b87-97f0eee68a64",
      "name": "Krit - Efficient Envoy",
      "gender": "masculine",
      "tone": "Professional adult male for smooth, everyday dialogue.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "th",
      "sampleDir": "samples/cartesia-sonic-3-th"
    },
    {
      "voiceId": "db938869-18b5-4c21-be8b-2ffdfba6d8d4",
      "name": "Thaksin - Tactful Tracker",
      "gender": "masculine",
      "tone": "Methodical adult male for structured professional interactions.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "th",
      "sampleDir": "samples/cartesia-sonic-3-th"
    },
    {
      "voiceId": "6d14ac2a-4dda-46f8-bd6f-0722db08ec00",
      "name": "Mae - Calm Authority",
      "gender": "feminine",
      "tone": "Grounded and soothing voice that conveys confidence.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "42332792-6e9f-4b2c-a106-3ff97e34a79d",
      "name": "Jerome - Empathetic Voice",
      "gender": "masculine",
      "tone": "Gentle and reassuring tone designed to offer comfort and build trust.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "d1c819ba-0384-496b-b63b-eb57a96a43cc",
      "name": "Angel - Welcoming Host",
      "gender": "feminine",
      "tone": "Hospitable and warm articulation that puts the listener at ease.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "8bfb1d08-a77a-4a7c-a4b7-af377380c6eb",
      "name": "Joy - Crisp Narrator",
      "gender": "feminine",
      "tone": "Sharp and precise delivery ideal for clearly explaining complex topics.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "21d8f579-b69c-42f0-8313-c50c6be05531",
      "name": "Liezel - Steady Informer",
      "gender": "feminine",
      "tone": "Reliable and consistent tone for general communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "5cd73b8e-703e-4f73-9e30-56876c620204",
      "name": "Juan - Clear Communicator",
      "gender": "masculine",
      "tone": "Crisp and articulate delivery designed for seamless information sharing.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "c4cbcb7d-d9fa-4eac-b547-46831718ef58",
      "name": "Angelo - Calm Narrator",
      "gender": "masculine",
      "tone": "Gentle young adult male voice with a calm and approachable tone for casual conversations,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "9261664a-c3d0-4200-9038-5466bcf3a09c",
      "name": "Luz - Casual Speaker",
      "gender": "feminine",
      "tone": "Natural and conversational adult female voice for everyday dialogue, friendly interactions, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tl",
      "sampleDir": "samples/cartesia-sonic-3-tl"
    },
    {
      "voiceId": "fa7bfcdc-603c-4bf1-a600-a371400d2f8c",
      "name": "Leyla - Story Companion",
      "gender": "feminine",
      "tone": "Expressive female for conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "39f753ef-b0eb-41cd-aa53-2f3c284f948f",
      "name": "Emre - Calming Speaker",
      "gender": "masculine",
      "tone": "Soothing male for calming dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "bb2347fe-69e9-4810-873f-ffd759fe8420",
      "name": "Aylin - Warm Guide",
      "gender": "feminine",
      "tone": "Friendly female for narrations and explainer videos",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "c1cfee3d-532d-47f8-8dd2-8e5b2b66bf1d",
      "name": "Taylan - Expressive Voice",
      "gender": "masculine",
      "tone": "Versatile articulate male for storytelling",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "5a31e4fb-f823-4359-aa91-82c0ae9a991c",
      "name": "Murat - Anatolian Storyteller",
      "gender": "masculine",
      "tone": "Deep male for narrations and audiobooks",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "8036098f-cff4-401e-bfba-f0a6a6e5e49b",
      "name": "Elif - Structured Supporter",
      "gender": "feminine",
      "tone": "Methodical adult female for precise and reliable assistance.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "91e91d74-8eb4-43cd-97d3-7466c21db00d",
      "name": "Zehra - Friendly Companion",
      "gender": "masculine",
      "tone": "Relaxed adult male voice with a natural and approachable tone for casual chats and everyday…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "0f95596c-09c4-4418-99fe-5c107e0713c0",
      "name": "Azra - Service Specialist",
      "gender": "feminine",
      "tone": "Firm and clear adult voice with a professional tone for instructions, customer service, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "tr",
      "sampleDir": "samples/cartesia-sonic-3-tr"
    },
    {
      "voiceId": "05ffab9c-d380-4909-8375-cd12f59238c3",
      "name": "Oleh - Professional Guy",
      "gender": "masculine",
      "tone": "Approachable adult male voice with a professional tone for casual conversations and everyday…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "uk",
      "sampleDir": "samples/cartesia-sonic-3-uk"
    },
    {
      "voiceId": "935a9060-373c-49e4-b078-f4ea6326987a",
      "name": "Linh - Soft Presence",
      "gender": "feminine",
      "tone": "Voice with gentle tone and natural warmth, perfect for natural conversations and friendly dialogue",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "vi",
      "sampleDir": "samples/cartesia-sonic-3-vi"
    },
    {
      "voiceId": "0e58d60a-2f1a-4252-81bd-3db6af45fb41",
      "name": "Minh - Conversational Partner",
      "gender": "masculine",
      "tone": "Easygoing adult male voice with a friendly tone for light conversation, casual dialogue, and…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "vi",
      "sampleDir": "samples/cartesia-sonic-3-vi"
    },
    {
      "voiceId": "b8cd71e3-bc14-4538-a530-d6314731c036",
      "name": "Xia - Calm Companion",
      "gender": "feminine",
      "tone": "Soft-spoken adult female voice for calm conversations and customer support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "vi",
      "sampleDir": "samples/cartesia-sonic-3-vi"
    },
    {
      "voiceId": "6eb8965c-e295-47bd-a9e4-3eeebb3abcff",
      "name": "Jing - Clear Coordinator",
      "gender": "feminine",
      "tone": "Clear Mandarin female for reliable business communication.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "7a5d4663-88ae-47b7-808e-8f9b9ee4127b",
      "name": "Hua - Sunny Support",
      "gender": "feminine",
      "tone": "Upbeat, happy young adult woman for engaging conversations and conversational support",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "eda5bbff-1ff1-4886-8ef1-4e69a77640a0",
      "name": "Kai - Commercial Man",
      "gender": "masculine",
      "tone": "Deep, friendly adult male for commercials and advertising",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "c59c247b-6aa9-4ab6-91f9-9eabea7dc69e",
      "name": "Tao - Lecturer",
      "gender": "masculine",
      "tone": "Friendly young adult male for presentations and educational content",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "bf32f849-7bc9-4b91-8c62-954588efcc30",
      "name": "Lan - Instructor",
      "gender": "feminine",
      "tone": "Firm, neutral adult woman for providing guidance and instruction",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "e90c6678-f0d3-4767-9883-5d0ecf5894a8",
      "name": "Yue - Gentle Woman",
      "gender": "feminine",
      "tone": "Kind adult female for empathetic conversations",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "653b9445-ae0c-4312-a3ce-375504cff31e",
      "name": "Liu - Plain Talker",
      "gender": "masculine",
      "tone": "Casual, neutral adult man for conversational support use cases",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "f9a4b3a6-b44b-469f-90e3-c8e19bd30e99",
      "name": "Shuwen - Precision Guide",
      "gender": "feminine",
      "tone": "Neutral, firm female for providing guidance and instruction",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "0b904166-a29f-4d2e-bb20-41ca302f98e9",
      "name": "Fei - Broadcast Narrator",
      "gender": "feminine",
      "tone": "Cheery, confident adult woman for narrations and announcements",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "7e2a44d1-76b8-42b8-9507-fedfe3a803c8",
      "name": "Jian - Direct Dispatcher",
      "gender": "masculine",
      "tone": "Formal Mandarin male for structured and capable support.",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "16212f18-4955-4be9-a6cd-2196ce2c11d1",
      "name": "Hao - Friendly Guy",
      "gender": "masculine",
      "tone": "Warm and friendly adult male voice for approachable conversations, customer support, and casual…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    },
    {
      "voiceId": "a53c3509-ec3f-425c-a223-977f5f7424dd",
      "name": "Mei - Expressive Assistant",
      "gender": "feminine",
      "tone": "Expressive adult female voice with a lively and engaging tone for storytelling, advertisements,…",
      "useCase": "Voice Agents, Customer Support",
      "ageRange": "Adult",
      "language": "zh",
      "sampleDir": "samples/cartesia-sonic-3-zh"
    }
  ],
  "sarvam/bulbul:v3": [
    {
      "voiceId": "bn-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "bn-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "bn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-bn"
    },
    {
      "voiceId": "en-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "en-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "en-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-en"
    },
    {
      "voiceId": "gu-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "gu-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "gu-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-gu"
    },
    {
      "voiceId": "hi-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "hi-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "hi-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-hi"
    },
    {
      "voiceId": "kn-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "kn-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "kn-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-kn"
    },
    {
      "voiceId": "ml-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "ml-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ml-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ml"
    },
    {
      "voiceId": "mr-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "mr-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "mr-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-mr"
    },
    {
      "voiceId": "od-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "od-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "od-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-od"
    },
    {
      "voiceId": "pa-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "pa-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "pa-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-pa"
    },
    {
      "voiceId": "ta-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "ta-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "ta-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-ta"
    },
    {
      "voiceId": "te-IN-shubh",
      "name": "Shubh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-aditya",
      "name": "Aditya",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-ritu",
      "name": "Ritu",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-priya",
      "name": "Priya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-neha",
      "name": "Neha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-rahul",
      "name": "Rahul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-pooja",
      "name": "Pooja",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-rohan",
      "name": "Rohan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-simran",
      "name": "Simran",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-kavya",
      "name": "Kavya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-amit",
      "name": "Amit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-dev",
      "name": "Dev",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-ishita",
      "name": "Ishita",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-shreya",
      "name": "Shreya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-ratan",
      "name": "Ratan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-varun",
      "name": "Varun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-manan",
      "name": "Manan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-sumit",
      "name": "Sumit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-roopa",
      "name": "Roopa",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-kabir",
      "name": "Kabir",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-aayan",
      "name": "Aayan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-ashutosh",
      "name": "Ashutosh",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-advait",
      "name": "Advait",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-anand",
      "name": "Anand",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-tanya",
      "name": "Tanya",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-tarun",
      "name": "Tarun",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-sunny",
      "name": "Sunny",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-mani",
      "name": "Mani",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-gokul",
      "name": "Gokul",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-vijay",
      "name": "Vijay",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-shruti",
      "name": "Shruti",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-suhani",
      "name": "Suhani",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-mohit",
      "name": "Mohit",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-kavitha",
      "name": "Kavitha",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-rehan",
      "name": "Rehan",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-soham",
      "name": "Soham",
      "gender": "masculine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    },
    {
      "voiceId": "te-IN-rupali",
      "name": "Rupali",
      "gender": "feminine",
      "tone": "Conversational",
      "useCase": "Voice Agents, Content Generation",
      "ageRange": "Adult",
      "language": "te-IN",
      "sampleDir": "samples/sarvam-bulbul-v3-te"
    }
  ]
};
