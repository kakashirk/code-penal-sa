// Grille générale des infractions — données officielles de l'État de San Andreas.
// Source : Annexe 2 (fournie en dur, indépendante des documents importés).

export type Regime = "A" | "S" | "P" | "F";
export type Niveau = 1 | 2 | 3 | 4;

export const CATEGORIES = [
  "Route",
  "Aérien",
  "Personnes",
  "Vols & braquages",
  "Dégradations",
  "Armes",
  "Stupéfiants",
  "Autorité & justice",
  "Crime organisé",
  "Économique",
  "Probité",
  "Ordre public",
  "Santé & environnement",
  "Cyber & élections",
] as const;

export type Categorie = (typeof CATEGORIES)[number];

export interface Infraction {
  nom: string;
  categorie: Categorie;
  niveau: Niveau;
  amendeAffichee: string;
  amendeNum: number;
  peineAffichee: string;
  peineMinutes: number;
  regime: Regime;
  complementaires: string;
  reference: string;
}

export const REGIME_LABELS: Record<Regime, string> = {
  A: "Amende seule",
  S: "Détention simple",
  P: "Pénitencier",
  F: "Fédérale",
};

export const NIVEAUX: Niveau[] = [1, 2, 3, 4];

export const NIVEAU_LABELS: Record<Niveau, string> = {
  1: "Niveau 1 — Contravention",
  2: "Niveau 2 — Délit",
  3: "Niveau 3 — Crime",
  4: "Niveau 4 — Crime fédéral",
};

// nom;categorie;niveau;amendeAffichee;amendeNum;peineAffichee;peineMinutes;regime;complementaires;reference
const CSV = `Nuisance sonore abusive;Route;1;2 000 $;2000;—;0;A;—;XI-5
Non-port du casque;Route;1;3 000 $;3000;—;0;A;Immobilisation si casque non possédé;XI-5
Demi-tour illégal;Route;1;5 000 $;5000;—;0;A;—;XI-5
Dérapages excessifs;Route;1;5 000 $;5000;—;0;A;—;XI-5
Franchissement du stop ou feu rouge;Route;1;5 000 $;5000;—;0;A;—;XI-5
Stationnement gênant;Route;1;5 000 $;5000;—;0;A;Fourrière (civile);XI-5
Véhicule en mauvais état;Route;1;5 000 $;5000;—;0;A;Fourrière (civile);XI-5
Circulation piétonne sur la chaussée;Route;1;7 000 $;7000;—;0;A;—;XI-5
Stationnement interdit;Route;1;7 000 $;7000;—;0;A;Fourrière (civile);XI-5
Entrave à la circulation;Route;1;10 000 $;10000;—;0;A;Fourrière (civile);XI-5
Véhicule inadapté à la circulation;Route;1;10 000 $;10000;—;0;A;Fourrière (civile);XI-5
Excès de vitesse < 20 km/h;Route;1;10 000 $;10000;—;0;A;—;XI-5
Téléphone au volant;Route;1;10 000 $;10000;—;0;A;—;XI-5
Refus de priorité;Route;2;5 000 $;5000;10 Min;10;S;—;XI-5
Conduite à contre-sens;Route;2;10 000 $;10000;10 Min;10;S;—;XI-5
Conduite imprudente;Route;2;10 000 $;10000;10 Min;10;S;—;XI-5
Conduite hors route;Route;2;10 000 $;10000;10 Min;10;S;Fourrière (SASP);XI-5
Excès de vitesse +20 à +50 km/h;Route;2;20 000 $;20000;10 Min;10;S;—;XI-5
Délit de fuite;Route;2;15 000 $;15000;20 Min;20;S;Fourrière (SASP);XI-5
Conduite sous alcool;Route;2;10 000 $;10000;30 Min;30;S;Fourrière (SASP);XI-5
Possession d'un brouilleur anti-radar;Route;2;20 000 $;20000;25 Min;25;S;Fourrière + retrait permis;XI-5
Défaut de permis de conduire;Route;2;15 000 $;15000;20 Min;20;S;Fourrière (SASP);XI-5
Conduite sous stupéfiants;Route;2;15 000 $;15000;30 Min;30;S;Fourrière (SASP);XI-5
Conduite dangereuse;Route;2;15 000 $;15000;20 Min;20;S;Fourrière (SASP);XI-5
Excès de vitesse > 50 km/h;Route;2;20 000 $;20000;20 Min;20;S;Fourrière (civile);XI-5
Excès de vitesse > 100 km/h;Route;2;50 000 $;50000;30 Min;30;S;Fourrière (SASP) + retrait permis;XI-5
Entrave / occupation du circuit aérien;Aérien;2;6 000 $;6000;20 Min;20;S;—;XI-9
Vol sous les altitudes minimales;Aérien;2;20 000 $;20000;10 Min;10;S;—;XI-9
Atterrissage hors zone autorisée;Aérien;2;25 000 $;25000;15 Min;15;S;—;XI-9
Survol d'une zone aérienne interdite;Aérien;2;50 000 $;50000;20 Min;20;S;Immobilisation possible;XI-9
Pilotage dangereux;Aérien;2;40 000 $;40000;30 Min;30;S;Immobilisation · retrait licence possible;XI-9
Pilotage sans licence;Aérien;2;50 000 $;50000;25 Min;25;S;Immobilisation de l'aéronef;XI-9
Insultes envers un civil;Personnes;2;7 000 $;7000;20 Min;20;S;—;V-1
Harcèlement;Personnes;2;10 000 $;10000;10 Min;10;S;50 % amende → victime;V-1
Menaces envers un civil;Personnes;2;15 000 $;15000;15 Min;15;S;—;V-1
Racisme / Discrimination;Personnes;2;15 000 $;15000;20 Min;20;S;—;V-1
Mise en danger de la vie d'autrui;Personnes;2;20 000 $;20000;20 Min;20;S;—;V-1
Coups et blessures sur citoyen;Personnes;2;30 000 $;30000;20 Min;20;S;Facture médicale à charge;V-1
Violences au sein du couple;Personnes;2;40 000 $;40000;30 Min;30;S;Facture médicale · éloignement possible;V-1
Non-assistance à personne en danger;Personnes;3;30 000 $;30000;40 Min;40;P;Interrogatoire obligatoire;V-1
Agression sexuelle;Personnes;3;150 000 $;150000;1 H;60;P;50 % amende → victime;V-1
Homicide involontaire;Personnes;3;75 000 $;75000;2 H;120;P;Saisie armes · retrait PPA;V-2
Tentative d'homicide sur civil;Personnes;3;100 000 $;100000;1 H;60;P;Saisie armes;V-2
Homicide volontaire sur civil;Personnes;3;250 000 $;250000;3 H;180;P;Saisie armes · retrait PPA;V-2
Tentative d'homicide sur représentant de l'État;Personnes;3;125 000 $;125000;2 H;120;P;Saisie armes;V-2
Homicide sur représentant de l'État;Personnes;4;400 000 $;400000;Fédérale;999;F;Saisie totalité des biens;V-2
Tentative de prise d'otage;Personnes;3;50 000 $;50000;30 Min;30;P;Saisie armes · retrait PPA;V-3
Prise d'otage sur civil;Personnes;3;100 000 $;100000;2 H;120;P;Saisie armes · retrait PPA;V-3
Tentative de prise d'otage sur représentant;Personnes;3;100 000 $;100000;45 Min;45;P;Saisie armes · retrait PPA;V-3
Prise d'otage sur représentant de l'État;Personnes;4;200 000 $;200000;Fédérale;999;F;Saisie totalité des biens;V-3
Prise d'otage sur le Gouverneur;Personnes;4;650 000 $;650000;Fédérale;999;F;Saisie totalité des biens;V-3
Séquestration / Enlèvement;Personnes;3;75 000 $ / victime;75000;1 H;60;P;Saisie armes · retrait PPA;V-3
Vol;Vols & braquages;2;10 000 $;10000;10 Min;10;S;Saisie butin · restitution;V-4
Vol de véhicule;Vols & braquages;2;15 000 $;15000;25 Min;25;S;Fourrière (SASP) · restitution;V-4
Vol avec violence (braquage sur civil);Vols & braquages;2;25 000 $;25000;25 Min;25;S;Saisie butin · confiscation arme;V-4
Vol de véhicule de fonction;Vols & braquages;3;30 000 $;30000;30 Min;30;P;Fourrière (SASP);V-4
Cambriolage;Vols & braquages;3;15 000 $;15000;25 Min;25;P;Saisie butin · restitution;V-4
Braquage d'ATM;Vols & braquages;3;10 000 $;10000;35 Min;35;P;Saisie du butin;V-5
Vol à main armée — Épicerie;Vols & braquages;3;35 000 $;35000;30 Min;30;P;Saisie armes + butin;V-5
Vol à main armée — Banque commerciale;Vols & braquages;3;150 000 $;150000;40 Min;40;P;Saisie armes + butin;V-5
Attaque d'un convoi de fonds;Vols & braquages;3;100 000 $;100000;1 H;60;P;Saisie armes + butin;V-5
Attaque d'un convoi SASP;Vols & braquages;3;150 000 $;150000;1 H;60;P;Saisie armes + fonds;V-5
Vol à main armée — Bijouterie;Vols & braquages;3;200 000 $;200000;1 H;60;P;Saisie armes + butin;V-5
Vol à main armée — Banque centrale;Vols & braquages;4;200 000 $;200000;Fédérale;999;F;Saisie armes + butin;V-5
Vol à main armée — Réserve fédérale;Vols & braquages;4;200 000 $;200000;Fédérale;999;F;Saisie armes + butin;V-5
Dégradation de biens publics;Dégradations;2;5 000 $;5000;10 Min;10;S;Remise en état à charge;V-6
Dégradation de biens privés;Dégradations;2;10 000 $;10000;10 Min;10;S;Dédommagement victime;V-6
Dégradation de matériel public;Dégradations;2;15 000 $;15000;10 Min;10;S;Remise en état à charge;V-6
Possession de biens servant à des actes illégaux;Dégradations;2;25 000 $ / unité;25000;20 Min;20;S;Saisie totalité;V-6
Intrusion dans une propriété privée;Dégradations;2;25 000 $;25000;30 Min;30;S;—;V-6
Intrusion dans un complexe gouvernemental;Dégradations;3;75 000 $;75000;50 Min;50;P;Saisie armes · retrait PPA;V-6
Port d'un casque balistique;Armes;2;20 000 $;20000;10 Min;10;S;Confiscation · palpation;V-7
Port d'un gilet pare-balles;Armes;2;25 000 $;25000;20 Min;20;S;Confiscation · palpation;V-7
Possession d'arme blanche illégale;Armes;2;19 000 $;19000;20 Min;20;S;Confiscation;V-8
Utilisation d'une arme à mauvais escient;Armes;2;28 000 $;28000;25 Min;25;S;Confiscation;V-7
Arme blanche sortie en public;Armes;2;20 000 $;20000;10 Min;10;S;Confiscation;V-7
Possession d'un dispositif prohibé (silencieux, n° limé);Armes;2;30 000 $;30000;25 Min;25;S;Saisie arme + dispositif;V-8
Arme létale sortie en public;Armes;2;35 000 $;35000;20 Min;20;S;Confiscation;V-7
Possession d'arme illégale catégorie 1;Armes;2;40 000 $;40000;25 Min;25;S;Saisie;V-8
Vente illégale d'arme catégorie 1;Armes;2;50 000 $;50000;25 Min;25;S;Saisie;V-8
Possession d'arme sans PPA;Armes;2;75 000 $;75000;45 Min;45;S;Saisie;V-8
Possession d'arme illégale catégorie 2;Armes;3;115 000 $;115000;35 Min;35;P;Saisie;V-8
Vente illégale d'arme catégorie 2;Armes;3;150 000 $;150000;35 Min;35;P;Saisie;V-8
Possession d'arme illégale catégorie 3;Armes;3;250 000 $;250000;1 H;60;P;Saisie;V-8
Vente illégale d'arme catégorie 3;Armes;3;350 000 $;350000;1 H;60;P;Saisie;V-8
Trafic d'armes;Armes;4;400 000 $;400000;Fédérale;999;F;Saisie armes + fonds + transports;V-8
Possession de weed;Stupéfiants;2;160 $ / unité;160;20 Min;20;S;Saisie totalité;V-9
Possession de LSD;Stupéfiants;2;150 $ / unité;150;25 Min;25;S;Saisie totalité;V-9
Possession de cocaïne;Stupéfiants;3;180 $ / unité;180;30 Min;30;P;Saisie totalité;V-9
Possession de méthamphétamine;Stupéfiants;3;200 $ / unité;200;30 Min;30;P;Saisie totalité;V-9
Possession de produits de fabrication;Stupéfiants;3;500 $ / unité;500;50 Min;50;P;Saisie totalité;V-9
Fabrication de stupéfiants;Stupéfiants;3;80 000 $;80000;50 Min;50;P;Saisie produits + matériel + locaux;V-9
Trafic de stupéfiants;Stupéfiants;3;100 000 $;100000;40 Min;40;P;Saisie produits + bénéfices;V-10
Trafic en bande organisée;Stupéfiants;4;150 000 $;150000;Fédérale;999;F;Saisie + moyens de transport;V-10
Franchissement d'un périmètre de sécurité;Autorité & justice;1;10 000 $;10000;—;0;A;Éloignement;V-12
Outrage à un représentant de l'État;Autorité & justice;2;10 000 $;10000;15 Min;15;S;—;V-11
Menaces à un représentant de l'État;Autorité & justice;2;15 000 $;15000;25 Min;25;S;—;V-11
Refus d'obtempérer;Autorité & justice;2;15 000 $;15000;15 Min;15;S;Fourrière du véhicule;V-11
Entrave aux services publics;Autorité & justice;2;15 000 $;15000;20 Min;20;S;—;V-11
Dénonciation calomnieuse;Autorité & justice;2;20 000 $;20000;20 Min;20;S;50 % amende → personne visée;V-12
Non-respect d'une décision de justice;Autorité & justice;2;25 000 $;25000;20 Min;20;S;Mandat d'arrestation;V-12
Coups et blessures sur représentant de l'État;Autorité & justice;2;40 000 $;40000;25 Min;25;S;Facture médicale à charge;V-11
Entrave / obstruction à la justice;Autorité & justice;2;50 000 $;50000;25 Min;25;S;—;V-12
Non-présentation à convocation;Autorité & justice;3;20 000 $ / jour;20000;40 Min;40;P;Mandat d'amener;V-12
Faux témoignage sous serment;Autorité & justice;3;50 000 $;50000;25 Min;25;P;—;V-12
Cavale;Autorité & justice;3;75 000 $;75000;30 Min;30;P;Fichier des recherchés;V-13
Violation du contrôle judiciaire;Autorité & justice;3;50 000 $;50000;45 Min;45;P;Incarcération immédiate;V-12
Destruction / dissimulation de preuve;Autorité & justice;3;100 000 $;100000;55 Min;55;P;Amende portée aux éléments détruits;V-12
Tentative d'évasion;Autorité & justice;3;300 000 $;300000;1 H;60;P;—;V-13
Évasion / organisation d'évasion;Autorité & justice;4;400 000 $;400000;Fédérale;999;F;Saisie totalité · s'ajoute au reliquat;V-13
Participation à une fusillade;Crime organisé;3;60 000 $;60000;40 Min;40;P;Saisie armes;V-14
Association de malfaiteurs;Crime organisé;3;80 000 $;80000;50 Min;50;P;Interrogatoire obligatoire;V-14
Membre d'un réseau de crime organisé;Crime organisé;3;200 000 $;200000;1 H;60;P;Saisie armes;V-14
Chef d'un réseau de crime organisé;Crime organisé;4;500 000 $;500000;Fédérale;999;F;Saisie totalité des biens;V-14
Attentat;Crime organisé;4;500 000 $;500000;Fédérale;999;F;Saisie totalité des biens;V-15
Escroquerie ≤ 90 000 $;Économique;2;25 000 à 100 000 $;100000;25 Min;25;S;Remboursement victime;VI-1
Escroquerie > 90 000 $;Économique;3;200 000 $;200000;45 Min;45;P;Remboursement victime;VI-1
Abus de confiance;Économique;2;30 000 $;30000;25 Min;25;S;Restitution;VI-2
Chantage;Économique;2;50 000 $;50000;25 Min;25;S;Restitution des fonds;VI-3
Racket / Extorsion;Économique;2;60 000 $;60000;25 Min;25;S;Confiscation arme · restitution;VI-3
Possession de fonds illicites (> 100 000 $);Économique;2;75 % du montant;0;35 Min;35;S;Saisie totalité;VI-5
Blanchiment de fonds illicites;Économique;3;75 % du montant;0;50 Min;50;P;Saisie totalité + instruments;VI-6
Blanchiment aggravé;Économique;4;150 % du montant;0;Fédérale;999;F;Saisie totalité · fermeture structure;VI-6
Détention de fausse monnaie;Économique;2;70 000 $;70000;25 Min;25;S;Saisie;VI-7
Mise en circulation de fausse monnaie;Économique;3;100 000 $;100000;45 Min;45;P;Saisie;VI-7
Fabrication de fausse monnaie;Économique;4;300 000 $;300000;Fédérale;999;F;Saisie monnaie + matériel;VI-7
Usage de documents falsifiés;Économique;2;40 000 $;40000;25 Min;25;S;Saisie;VI-8
Contrefaçon de biens ou de marques;Économique;2;30 000 $;30000;20 Min;20;S;Saisie marchandises;VI-8
Falsification de documents officiels;Économique;3;80 000 $;80000;40 Min;40;P;Saisie · retrait du titre;VI-8
Emploi non contractualisé;Économique;1;50 000 $;50000;—;0;A;Régularisation;VI-9
Défaut de paiement du salaire;Économique;1;50 000 $;50000;—;0;A;Rappel des salaires;VI-9
Licenciement abusif;Économique;1;80 000 $;80000;—;0;A;50 % amende → victime;VI-9
Refus de transmission de comptabilité;Économique;1;150 000 $;150000;—;0;A;Transmission sous astreinte;VI-9
Entrave au fonctionnement d'une entreprise;Économique;2;12 000 $;12000;20 Min;20;S;—;VI-10
Abus de biens sociaux;Économique;3;100 000 $;100000;40 Min;40;P;Remboursement · interdiction de gérer;VI-10
Comptabilité falsifiée;Économique;3;120 000 $;120000;40 Min;40;P;Transmission sous astreinte;VI-10
Fraude aux subventions d'État;Économique;3;100 000 $;100000;40 Min;40;P;Remboursement intégral;VI-11
Revente anticipée d'un fonds de commerce;Économique;1;3 000 000 $;3000000;—;0;A;—;IX-10
Intrusion dans un système financier de l'État;Économique;3;150 000 $;150000;50 Min;50;P;Saisie matériel;VI-12
Atteinte majeure aux systèmes financiers;Économique;4;500 000 $;500000;Fédérale;999;F;Saisie totalité des biens;VI-12
Usurpation d'identité ou de fonction;Probité;2;15 000 $;15000;20 Min;20;S;—;VII-3
Abus de pouvoir;Probité;2;30 000 $;30000;25 Min;25;S;Destitution / rétrogradation;VII-2
Tentative de corruption;Probité;2;35 000 $;35000;25 Min;25;S;Interrogatoire obligatoire;VII-1
Divulgation illégale d'un casier;Probité;2;50 000 $;50000;25 Min;25;S;Destitution si agent;VII-4
Violation du secret professionnel;Probité;2;50 000 $;50000;25 Min;25;S;Signalement à l'ordre;VII-4
Bavure;Probité;3;120 000 $;120000;30 Min;30;P;Destitution · facture médicale;VII-2
Violation du secret de l'enquête;Probité;3;120 000 $;120000;30 Min;30;P;Destitution si agent;VII-4
Corruption;Probité;3;120 000 $;120000;40 Min;40;P;Destitution · saisie des sommes;VII-1
Port illégal d'uniforme officiel;Probité;3;150 000 $;150000;45 Min;45;P;Confiscation;VII-3
Violences graves / torture par agent public;Probité;4;200 000 $;200000;Fédérale;999;F;Destitution · interdiction définitive;VII-2
Consommation d'alcool sur la voie publique;Ordre public;1;5 000 $;5000;—;0;A;Confiscation;VII-5
Occupation illégale de l'espace public;Ordre public;2;7 000 $;7000;10 Min;10;S;Évacuation;VII-5
Dissimulation du visage;Ordre public;2;8 000 $;8000;10 Min;10;S;Palpation obligatoire;VII-6
Participation à une manifestation illégale;Ordre public;2;10 000 $;10000;20 Min;20;S;—;VII-5
Violation d'un couvre-feu;Ordre public;2;15 000 $;15000;10 Min;10;S;Reconduite;VII-6
Organisation d'une manifestation illégale;Ordre public;2;25 000 $;25000;20 Min;20;S;Dispersion;VII-5
Vente d'alcool / tabac à un mineur de 21 ans;Santé & environnement;1;20 000 $;20000;—;0;A;Confiscation · avertissement;VII-8
Vente illégale de matériel médical;Santé & environnement;2;50 000 $;50000;20 Min;20;S;Saisie;VII-7
Violation du secret médical;Santé & environnement;2;50 000 $;50000;25 Min;25;S;Signalement au SAMS;VII-7
Exercice illégal de la médecine;Santé & environnement;3;80 000 $;80000;30 Min;30;P;Interdiction d'exercer · saisie;VII-7
Falsification d'un dossier médical;Santé & environnement;3;80 000 $;80000;40 Min;40;P;Destitution si SAMS;VII-7
Pollution volontaire d'un milieu naturel;Santé & environnement;2;25 000 $;25000;15 Min;15;S;Remise en état;VII-9
Violation du silence électoral;Cyber & élections;1;25 000 $;25000;—;0;A;Retrait des supports;VII-11
Entrave au droit de vote;Cyber & élections;2;100 000 $;100000;25 Min;25;S;—;VII-11
Accès frauduleux à un système informatique;Cyber & élections;3;80 000 $;80000;40 Min;40;P;Saisie matériel;VII-10
Fraude électorale;Cyber & élections;3;100 000 $;100000;40 Min;40;P;Annulation suffrages · inéligibilité;VII-11
Cybercriminalité de grande ampleur;Cyber & élections;4;300 000 $;300000;Fédérale;999;F;Saisie matériel + fonds;VII-10`;

function parseCsv(csv: string): Infraction[] {
  const categories = new Set<string>(CATEGORIES);
  return csv
    .trim()
    .split("\n")
    .filter((ligne) => ligne.trim().length > 0)
    .map((ligne) => {
      const c = ligne.split(";");
      if (c.length !== 10) {
        throw new Error(`Ligne CSV invalide (${c.length} colonnes) : ${ligne}`);
      }
      const niveau = Number(c[2]);
      if (![1, 2, 3, 4].includes(niveau)) {
        throw new Error(`Niveau invalide : ${ligne}`);
      }
      if (!categories.has(c[1])) {
        throw new Error(`Catégorie inconnue « ${c[1]} » : ${ligne}`);
      }
      if (!["A", "S", "P", "F"].includes(c[7])) {
        throw new Error(`Régime invalide « ${c[7]} » : ${ligne}`);
      }
      return {
        nom: c[0],
        categorie: c[1] as Categorie,
        niveau: niveau as Niveau,
        amendeAffichee: c[3],
        amendeNum: Number(c[4]),
        peineAffichee: c[5],
        peineMinutes: Number(c[6]),
        regime: c[7] as Regime,
        complementaires: c[8],
        reference: c[9],
      };
    });
}

export const INFRACTIONS: Infraction[] = parseCsv(CSV);
