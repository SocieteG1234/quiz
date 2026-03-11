import { useState, useCallback, useEffect } from "react";

// ─── ROUTER (hash-based, no external dep) ───────────────────────────────────
function useRouter() {
  const [route, setRoute] = useState(() => window.location.hash.replace("#","") || "home");
  const navigate = (r) => { window.location.hash = r; setRoute(r); };
  useEffect(() => {
    const h = () => setRoute(window.location.hash.replace("#","") || "home");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return { route, navigate };
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  { id:0, label:"Généralités",    icon:"🧠" },
  { id:1, label:"La Mémoire",     icon:"💾" },
  { id:2, label:"L'Intelligence", icon:"⚡" },
  { id:3, label:"La Motivation",  icon:"🔥" },
  { id:4, label:"La Perception",  icon:"👁️" },
  { id:5, label:"Apprentissage",  icon:"📚" },
  { id:6, label:"Développement",  icon:"🌱" },
];

const BIOGRAPHIES = [
  {
    id:"wundt", name:"Wilhelm Wundt", dates:"1832–1920", flag:"🇩🇪",
    role:"Père fondateur de la psychologie expérimentale",
    avatar:"W", color:"#7c3aed",
    facts:[
      "Créé le 1er laboratoire de psychologie expérimentale à Leipzig en 1879",
      "Transformé la psychologie de branche philosophique en science rigoureuse",
      "A introduit la méthode introspective en laboratoire",
      "Auteur de plus de 53 000 pages d'œuvres scientifiques"
    ],
    quote:"La psychologie doit être une science naturelle.",
    chapters:[0]
  },
  {
    id:"watson", name:"John B. Watson", dates:"1878–1958", flag:"🇺🇸",
    role:"Fondateur du béhaviorisme",
    avatar:"W", color:"#0891b2",
    facts:[
      "Fonde le béhaviorisme en 1913 avec son manifeste 'Psychology as the Behaviorist Views It'",
      "Pour lui, la psychologie ne doit étudier que les comportements OBSERVABLES",
      "Célèbre pour l'expérience du 'Petit Albert'",
      "Définit la psychologie comme science de l'adaptation de la naissance à la mort"
    ],
    quote:"Donnez-moi une douzaine d'enfants sains, bien conformés, et mon propre monde pour les élever…",
    chapters:[0,5]
  },
  {
    id:"pavlov", name:"Ivan Pavlov", dates:"1849–1936", flag:"🇷🇺",
    role:"Découvreur du conditionnement classique",
    avatar:"P", color:"#059669",
    facts:[
      "Prix Nobel de Physiologie en 1904 pour ses travaux sur la digestion",
      "Découvre par accident le réflexe conditionné en observant la salivation des chiens",
      "Fondamental pour comprendre l'apprentissage associatif",
      "Ses concepts (SC, SI, RC, RI) sont encore utilisés en thérapie comportementale"
    ],
    quote:"Ne pas cesser d'observer, de chercher, de douter.",
    chapters:[5]
  },
  {
    id:"piaget", name:"Jean Piaget", dates:"1896–1980", flag:"🇨🇭",
    role:"Fondateur de l'épistémologie génétique",
    avatar:"P", color:"#d97706",
    facts:[
      "Définit 4 stades universels du développement cognitif (0→adulte)",
      "Introduit les concepts d'assimilation, accommodation et équilibration",
      "Pour lui : le développement PRÉCÈDE l'apprentissage",
      "Fondateur de l'épistémologie génétique (comment se construisent les connaissances)"
    ],
    quote:"L'intelligence, c'est ce qu'on utilise quand on ne sait pas quoi faire.",
    chapters:[2,5,6]
  },
  {
    id:"vygotsky", name:"Lev Vygotsky", dates:"1896–1934", flag:"🇷🇺",
    role:"Fondateur du socio-constructivisme",
    avatar:"V", color:"#dc2626",
    facts:[
      "Introduit le concept révolutionnaire de ZPD (Zone Proximale de Développement)",
      "Pour lui : 'La vraie direction va du SOCIAL à l'INDIVIDUEL'",
      "L'apprentissage TIRE le développement (≠ Piaget)",
      "Mort à 37 ans, mais son œuvre reste fondamentale en pédagogie"
    ],
    quote:"Ce que l'enfant sait faire aujourd'hui en collaboration, il le fera seul demain.",
    chapters:[5,6]
  },
  {
    id:"bandura", name:"Albert Bandura", dates:"1925–2021", flag:"🇨🇦",
    role:"Père de la théorie de l'apprentissage social",
    avatar:"B", color:"#7c3aed",
    facts:[
      "Théorie de l'apprentissage vicariant : on apprend par OBSERVATION d'autrui",
      "Célèbre expérience de la poupée Bobo (1961) : l'agression s'apprend par imitation",
      "Introduit le concept d'auto-efficacité (self-efficacy)",
      "4 processus : attentionnel, rétention, reproduction motrice, motivationnel"
    ],
    quote:"La plupart des comportements humains sont appris par l'observation de modèles.",
    chapters:[5]
  },
  {
    id:"maslow", name:"Abraham Maslow", dates:"1908–1970", flag:"🇺🇸",
    role:"Fondateur de la psychologie humaniste",
    avatar:"M", color:"#0891b2",
    facts:[
      "Crée la célèbre pyramide des besoins à 5 niveaux",
      "Les besoins physiologiques ET de sécurité doivent être satisfaits en premier",
      "Seulement 1% des individus atteindraient la réalisation de soi",
      "Sa pyramide est très utilisée en management, sport et pédagogie"
    ],
    quote:"Ce qu'un homme peut être, il doit l'être.",
    chapters:[3]
  },
  {
    id:"freud", name:"Sigmund Freud", dates:"1856–1939", flag:"🇦🇹",
    role:"Fondateur de la psychanalyse",
    avatar:"F", color:"#b45309",
    facts:[
      "Fonde la psychanalyse et découvre l'inconscient comme moteur du comportement",
      "Concept du refoulement : on oublie inconsciemment ce qui est douloureux",
      "Développe la méthode des associations libres et l'interprétation des rêves",
      "Divise la psyché en Ça, Moi et Surmoi"
    ],
    quote:"L'inconscient est le vrai psychisme.",
    chapters:[0,1]
  },
  {
    id:"skinner", name:"B.F. Skinner", dates:"1904–1990", flag:"🇺🇸",
    role:"Père du conditionnement opérant",
    avatar:"S", color:"#059669",
    facts:[
      "Développe le conditionnement opérant : le comportement est contrôlé par ses conséquences",
      "Invente la 'boîte de Skinner' (chambre d'apprentissage pour animaux)",
      "Distingue renforcement positif, négatif, et punition",
      "Applications : thérapie comportementale, éducation, entraînement sportif"
    ],
    quote:"Le comportement est façonné et maintenu par ses conséquences.",
    chapters:[5]
  },
];

// ─── QUESTIONS STANDARDS (extrait conservé + nouvelles) ─────────────────────
const BASE_QUESTIONS = [
  { id:1,  c:0, type:"qcm", q:"Que signifie 'psychologie' d'après son étymologie grecque ?", opts:["Science du corps","Science de l'âme et de l'esprit","Science du comportement observable","Science de la société"], ans:1, exp:"Du grec psychê (âme/esprit) + logos (science). Wundt l'a transformée en science expérimentale en 1879." },
  { id:2,  c:0, type:"qcm", q:"Qui a créé le premier laboratoire de psychologie expérimentale ?", opts:["Freud à Vienne en 1895","Watson à Chicago en 1913","Wundt à Leipzig en 1879","Pavlov à Saint-Pétersbourg en 1890"], ans:2, exp:"Wilhelm Wundt (1832-1920) fonda le 1er laboratoire à Leipzig en 1879." },
  { id:3,  c:0, type:"qcm", q:"Selon Watson (1913), quel est l'objet de la psychologie ?", opts:["L'étude de l'inconscient","L'étude de ce que font les êtres vivants de leur naissance à leur mort","L'étude des processus mentaux internes","L'étude des émotions et de la personnalité"], ans:1, exp:"Watson (1913) : psychologie = science de l'adaptation des faits humains de la naissance à la mort." },
  { id:5,  c:0, type:"qcm", q:"Dans la méthode expérimentale, qu'est-ce que la Variable Indépendante (VI) ?", opts:["L'effet observé","La cause manipulée par l'expérimentateur","La réponse du sujet","Le comportement mesuré"], ans:1, exp:"VI = cause manipulée. VD (Variable Dépendante) = effet observé/mesuré." },
  { id:7,  c:0, type:"qcm", q:"Qui est le pionnier de la psychologie du sport en France ?", opts:["Wilhelm Wundt","Sigmund Freud","Georges Rioux","Jean Piaget"], ans:2, exp:"Georges Rioux, professeur à l'Université de Tours, pionnier de la psychologie du sport en France." },
  { id:8,  c:0, type:"qcm", q:"Quelle critique principale fait-on à la méthode introspective ?", opts:["Elle est trop coûteuse","Les informations sont subjectives et non vérifiables","Elle ne peut pas étudier les adultes","Elle nécessite des instruments complexes"], ans:1, exp:"L'introspection est subjective : un observateur ne peut vérifier ce que le sujet rapporte." },
  { id:13, c:0, type:"vf", q:"La psychologie béhavioriste étudie principalement les processus inconscients.", ans:false, exp:"Faux. Le béhaviorisme (Watson) étudie UNIQUEMENT les comportements observables et mesurables. L'inconscient, c'est la psychanalyse." },
  { id:14, c:0, type:"vf", q:"Jusqu'en 1870, la psychologie était une branche de la philosophie.", ans:true, exp:"Vrai. De l'Antiquité jusqu'en 1870, la psychologie s'inscrivait dans l'histoire de la philosophie." },
  { id:15, c:0, type:"vf", q:"L'hypothèse est une affirmation définitive et prouvée sur un comportement.", ans:false, exp:"Faux. L'hypothèse est une réponse anticipée et PROVISOIRE. Elle doit être testée." },
  { id:17, c:0, type:"def", q:"Définissez la PSYCHOLOGIE selon le cours.", answer:"La psychologie est la science qui étudie le comportement des individus et leurs processus mentaux (intelligence, langage, mémoire). Elle recouvre théories, pratiques, méthodes et expériences. Son objet est le comportement humain sous tous ses aspects psychiques, normaux ou pathologiques.", keywords:["comportement","processus mentaux","science","individus","normaux","pathologiques"], exp:"Étymologie : psychê (âme) + logos (science)." },
  { id:100, c:1, type:"qcm", q:"Quelles sont les 3 étapes de la mémoire comme système de traitement ?", opts:["Attention, perception, mémorisation","Encodage, rétention/stockage, récupération","Apprentissage, consolidation, oubli","Codage, décodage, rappel"], ans:1, exp:"Encodage → Rétention/Stockage → Récupération." },
  { id:101, c:1, type:"qcm", q:"Quelle mémoire stocke les savoir-faire et gestes automatisés ?", opts:["Mémoire épisodique","Mémoire sémantique","Mémoire procédurale","Mémoire sensorielle"], ans:2, exp:"La mémoire procédurale stocke les capacités perceptuelles, cognitives et motrices." },
  { id:104, c:1, type:"qcm", q:"Quel neurotransmetteur est déficient dans la maladie d'Alzheimer ?", opts:["Dopamine","Sérotonine","Acétylcholine","Adrénaline"], ans:2, exp:"L'acétylcholine est crucial pour la mémoire. Sa pénurie explique la maladie d'Alzheimer." },
  { id:105, c:1, type:"qcm", q:"Quelle structure cérébrale est impliquée dans l'encodage de la mémoire déclarative ?", opts:["Le cortex frontal","L'hippocampe","Le cervelet","Le cortex moteur"], ans:1, exp:"L'hippocampe : encodage, consolidation, rappel des souvenirs déclaratifs." },
  { id:110, c:1, type:"vf", q:"La mémoire à court terme (MCT) a une capacité de stockage illimitée.", ans:false, exp:"Faux. La MCT a une capacité LIMITÉE à quelques éléments. C'est la MLT qui a une capacité illimitée." },
  { id:112, c:1, type:"vf", q:"Le stress améliore toujours la mémoire.", ans:false, exp:"Faux. Le stress libère des glucocorticoïdes qui perturbent l'encodage dans l'hippocampe." },
  { id:115, c:1, type:"def", q:"Définissez la MÉMOIRE selon le cours.", answer:"La mémoire est la capacité d'un système naturel ou artificiel à encoder l'information extraite de son expérience, à la stocker dans un format approprié, puis à la récupérer pour l'utiliser dans ses actions.", keywords:["encoder","stocker","récupérer","expérience","système"], exp:"3 étapes : encodage → rétention/stockage → récupération." },
  { id:116, c:1, type:"def", q:"Expliquez la différence entre MÉMOIRE DÉCLARATIVE et MÉMOIRE PROCÉDURALE.", answer:"La mémoire déclarative concerne les souvenirs de faits et d'événements (savoir QUE). La mémoire procédurale concerne les savoir-faire, gestes et automatismes (savoir COMMENT faire : nager, dribbler).", keywords:["déclarative","faits","événements","procédurale","savoir-faire","automatismes"], exp:"Ex : se souvenir de son anniversaire = déclarative. Savoir nager = procédurale." },
  { id:200, c:2, type:"qcm", q:"Selon William Stern (1912), comment se calcule le QI ?", opts:["QI = Âge Réel / Âge Mental × 100","QI = Âge Mental / Âge Réel × 100","QI = (AM + AR) / 2","QI = AM × AR / 100"], ans:1, exp:"William Stern (1912) : QI = Âge Mental / Âge Réel × 100. La moyenne est fixée à 100." },
  { id:202, c:2, type:"qcm", q:"Quels sont les 3 facteurs de développement de l'intelligence selon Piaget ?", opts:["Hérédité, environnement, hasard","Maturation neurologique, exercice/expérience, interactions sociales","QI, EQ, CI","Génétique, alimentation, éducation"], ans:1, exp:"3 facteurs : maturation neurologique, exercice et expérience, interactions sociales." },
  { id:203, c:2, type:"qcm", q:"À quel stade de Piaget l'enfant développe-t-il la pensée symbolique et le jeu ?", opts:["Sensori-moteur","Pré-opératoire","Opérations concrètes","Opérations formelles"], ans:1, exp:"Stade pré-opératoire (2-7 ans) : fonction symbolique (langage, jeu, dessin). Mais égocentrisme cognitif." },
  { id:205, c:2, type:"qcm", q:"À quel stade l'enfant accède-t-il à la notion de réversibilité ?", opts:["Sensori-moteur","Pré-opératoire","Opérations concrètes","Opérations formelles"], ans:2, exp:"Stade opératoire concret (7-12 ans) : réversibilité, conservation des mesures, classifications." },
  { id:210, c:2, type:"vf", q:"Le QI mesure la totalité de l'intelligence d'un individu.", ans:false, exp:"Faux. Le QI ne mesure qu'une partie (analytique/logique). Il ne mesure pas les intelligences motrices, musicales, sociales." },
  { id:212, c:2, type:"vf", q:"Pour Piaget, tous les enfants passent par les mêmes stades dans le même ordre.", ans:true, exp:"Vrai. Les stades sont universels et invariants. Le rythme et la durée varient." },
  { id:214, c:2, type:"def", q:"Définissez l'ASSIMILATION et l'ACCOMMODATION selon Piaget.", answer:"L'assimilation est l'intégration des données de l'expérience dans la structure existante de l'individu. L'accommodation est la modification de la structure de l'individu en fonction des données nouvelles du milieu. L'adaptation est l'équilibre entre les deux.", keywords:["assimilation","intégration","accommodation","modification","adaptation","équilibre"], exp:"L'intelligence se construit par l'interaction de ces deux mécanismes." },
  { id:300, c:3, type:"qcm", q:"Selon Goldenson (1970), la motivation est :", opts:["L'ensemble des besoins biologiques","La dynamique du comportement et de son maintien","La récompense obtenue après un effort","La pression sociale exercée sur l'individu"], ans:1, exp:"Goldenson (1970) : la motivation est la dynamique du comportement et de son maintien." },
  { id:303, c:3, type:"qcm", q:"Dans la pyramide de Maslow, quel besoin est au sommet ?", opts:["Sécurité","Appartenance","Estime personnelle","Réalisation de soi"], ans:3, exp:"Sommet = réalisation de soi (niveau 5). Maslow : niveaux 4 et 5 rarement atteints." },
  { id:305, c:3, type:"qcm", q:"Selon Mac Clelland (1961), les personnes à fort besoin de réussite :", opts:["Choisissent des objectifs impossibles","Choisissent des défis intermédiaires","Évitent toute situation d'évaluation","Attribuent leur échec à la malchance"], ans:1, exp:"Mac Clelland (1961) : fort besoin de réussite → défis intermédiaires (ni trop faciles, ni impossibles)." },
  { id:308, c:3, type:"vf", q:"Selon Maslow, les besoins physiologiques doivent être satisfaits avant d'accéder aux besoins supérieurs.", ans:true, exp:"Vrai. Maslow : besoins physiologiques et de sécurité DOIVENT être satisfaits pour accéder aux besoins supérieurs." },
  { id:309, c:3, type:"vf", q:"La motivation extrinsèque (récompenses) augmente toujours la motivation intrinsèque.", ans:false, exp:"Faux. Harlon et Deci ont montré que les récompenses externes DIMINUENT la motivation intrinsèque." },
  { id:312, c:3, type:"def", q:"Définissez la MOTIVATION selon le cours.", answer:"La motivation est l'ensemble des mécanismes biologiques et physiologiques qui permettent le déclenchement de l'action, son orientation, son intensité et sa persistance. Pour Goldenson (1970), c'est la dynamique du comportement et de son maintien.", keywords:["déclenchement","orientation","intensité","persistance","comportement","Goldenson"], exp:"3 types : fondamentales, stimulation, acquises secondaires." },
  { id:400, c:4, type:"qcm", q:"La perception est définie dans le cours comme :", opts:["La réception brute des stimuli par les organes des sens","L'ensemble des mécanismes par lesquels l'organisme prend connaissance du monde","La mémorisation des expériences sensorielles","La réaction motrice à un stimulus"], ans:1, exp:"Perception = ensemble des mécanismes par lesquels l'organisme prend connaissance du monde." },
  { id:402, c:4, type:"qcm", q:"La PROPRIOCEPTION est :", opts:["La vision en 3D","Le sens de l'équilibre","Le sens qui renseigne sur la position du corps dans l'espace","La capacité à percevoir les sons graves"], ans:2, exp:"Proprioception = 6e sens qui renseigne sur la position et les mouvements du corps dans l'espace." },
  { id:404, c:4, type:"qcm", q:"Quelle est la différence entre SENSATION et PERCEPTION ?", opts:["Ce sont des synonymes","Sensation = physiologique (détection), Perception = psychologique (interprétation)","Sensation = psychologique, Perception = physiologique","Sensation est plus précise que la perception"], ans:1, exp:"Sensation = détection physiologique. Perception = interprétation psychologique." },
  { id:408, c:4, type:"vf", q:"La perception est une copie exacte et fidèle de la réalité.", ans:false, exp:"Faux. La perception est une CONSTRUCTION active du cerveau, influencée par l'attention, l'expérience, les émotions." },
  { id:410, c:4, type:"vf", q:"L'approche Top-down signifie que nos connaissances influencent notre perception.", ans:true, exp:"Vrai. Top-down (Bruner) : les connaissances s'imposent à l'environnement." },
  { id:412, c:4, type:"def", q:"Définissez la PERCEPTION selon le cours.", answer:"La perception se définit comme l'ensemble des mécanismes par lesquels l'organisme prend connaissance du monde, sur la base des informations du sujet. Le système perceptif transforme des stimulations en informations. C'est le traitement de l'information et la représentation du monde physique.", keywords:["mécanismes","prise d'informations","stimulations","traitement","représentation"], exp:"Sensation = physiologique. Perception = psychologique." },
  { id:500, c:5, type:"qcm", q:"Selon Reuchlin (1977), il y a apprentissage quand :", opts:["L'individu mémorise une information","Un individu placé plusieurs fois dans la même situation modifie sa conduite de façon systématique et durable","Le sujet reproduit exactement un comportement observé","L'individu reçoit une récompense"], ans:1, exp:"Reuchlin (1977) : apprentissage = modification systématique et DURABLE de la conduite." },
  { id:503, c:5, type:"qcm", q:"Pavlov a découvert le conditionnement classique en étudiant :", opts:["Des rats dans un labyrinthe","La digestion des chiens","Des singes en cage","Des enfants en bas âge"], ans:1, exp:"Pavlov utilisait des chiens pour des études sur la digestion. Prix Nobel." },
  { id:506, c:5, type:"qcm", q:"Qui a développé le conditionnement opérant ?", opts:["Pavlov","Watson","Skinner (1904-1988)","Thorndike"], ans:2, exp:"BF Skinner (1904-1988) développe le conditionnement opérant." },
  { id:507, c:5, type:"qcm", q:"La ZPD de Vygotsky est la distance entre :", opts:["Le niveau actuel (seul) et le niveau potentiel (avec aide)","Le niveau scolaire et le niveau réel","L'âge mental et l'âge chronologique","Ce que l'enfant sait et ce qu'il ne sait pas"], ans:0, exp:"ZPD = distance entre ce que l'enfant peut faire seul (développement actuel) et avec aide (niveau potentiel)." },
  { id:508, c:5, type:"qcm", q:"Qui est l'auteur de la théorie de l'apprentissage social (vicariant) ?", opts:["Piaget","Vygotsky","Bandura (1971)","Bruner"], ans:2, exp:"Albert Bandura (1971) : théorie de l'apprentissage vicariant. Apprendre par observation d'autrui." },
  { id:511, c:5, type:"qcm", q:"Le renforcement NÉGATIF consiste à :", opts:["Punir un comportement indésirable","Retirer un stimulus désagréable pour augmenter la fréquence d'un comportement","Présenter un stimulus désagréable","Ignorer un comportement"], ans:1, exp:"Renforcement négatif = retirer un stimulus DÉSAGRÉABLE pour augmenter la fréquence du comportement." },
  { id:513, c:5, type:"vf", q:"Pour Vygotsky, la vraie direction du développement va de l'individuel au social.", ans:false, exp:"Faux. Vygotsky : 'La vraie direction du développement va du SOCIAL à l'INDIVIDUEL.'" },
  { id:514, c:5, type:"vf", q:"Selon Bandura, l'être humain n'apprend que par essai-erreur direct.", ans:false, exp:"Faux. Bandura montre que l'être humain apprend aussi par OBSERVATION d'autrui (apprentissage vicariant)." },
  { id:517, c:5, type:"def", q:"Définissez l'APPRENTISSAGE selon le cours.", answer:"L'apprentissage désigne la modification systématique des connaissances, du comportement et des capacités en fonction de l'entraînement. Selon Reuchlin (1977) : modification systématique et durable de la conduite dans une même situation.", keywords:["modification systématique","comportement","connaissances","capacités","durable"], exp:"Doré & Mercier (1992) : acquérir des connaissances sur le monde et les modifier." },
  { id:518, c:5, type:"def", q:"Définissez la ZPD de Vygotsky et son importance pédagogique.", answer:"La Zone Proximale de Développement (ZPD) est la distance entre deux niveaux : le niveau de développement actuel (ce que l'enfant peut faire seul) et le niveau de développement potentiel (ce qu'il peut faire avec l'aide d'un adulte ou d'un pair). C'est dans la ZPD que l'enseignant doit intervenir.", keywords:["distance","développement actuel","seul","potentiel","aide","adulte","ZPD"], exp:"Vygotsky : 'Ce que l'enfant sait faire aujourd'hui en collaboration, il saura le faire tout seul demain.'" },
  { id:600, c:6, type:"qcm", q:"Qui a créé le premier laboratoire de psychologie de l'enfant en 1883 ?", opts:["Wundt","Piaget","Hall","Darwin"], ans:2, exp:"Hall a créé le premier laboratoire de psychologie de l'enfant en 1883. Il a créé la 'paidologie'." },
  { id:602, c:6, type:"qcm", q:"La CROISSANCE se distingue de la MATURATION car :", opts:["La croissance est inférée du comportement","La croissance = modifications physiques observables, la maturation = processus internes inférés","Elles sont synonymes","La croissance concerne le cerveau, la maturation le corps"], ans:1, exp:"Croissance = modifications physiques OBSERVABLES. Maturation = processus INTERNES inférés." },
  { id:604, c:6, type:"qcm", q:"Le développement Céphalo-Caudal signifie que :", opts:["Le développement va du proche vers l'éloigné du SNC","Le développement va de la tête aux pieds","Le développement est continu et régulier","Le développement va du simple au complexe"], ans:1, exp:"Céphalo-Caudal = de la tête aux pieds (tenir la tête → assis → debout → marche)." },
  { id:611, c:6, type:"vf", q:"Le développement physique suit un ordre Céphalo-Caudal (de la tête aux pieds).", ans:true, exp:"Vrai. 2 axes : Céphalo-Caudal (tête→pieds) et Proximo-Distal (proche→éloigné du SNC)." },
  { id:612, c:6, type:"vf", q:"Le débat inné/acquis est aujourd'hui considéré comme dépassé.", ans:true, exp:"Vrai. Le développement est aujourd'hui le résultat de l'INTERACTION entre facteurs biologiques ET sociaux." },
  { id:613, c:6, type:"vf", q:"Durant le vieillissement, il n'y a que des pertes, pas de gains.", ans:false, exp:"Faux. Le développement est multidirectionnel. Vieillissement : pertes (neurones) MAIS AUSSI gains (sagesse)." },
  { id:616, c:6, type:"def", q:"Définissez la PSYCHOLOGIE DU DÉVELOPPEMENT.", answer:"La psychologie du développement étudie les changements développementaux et les différents facteurs qui interviennent sur ces changements et leurs interactions, de la conception à la mort de l'individu. Elle étudie la croissance (modifications physiques observables) et la maturation (processus internes inférés, cognitif, affectif et neuronal).", keywords:["changements développementaux","conception","mort","croissance","maturation"], exp:"3 niveaux : Ontogenèse (individu), Phylogenèse (espèce), Microgenèse (situation particulière)." },
];

// ─── NOUVELLES QUESTIONS : REFORMULÉES / SYNTHÈSE / APPLICATIONS ─────────────
const NEW_QUESTIONS = [
  // REFORMULÉES différemment
  { id:1001, c:0, type:"qcm", tag:"reformulé",
    q:"Un entraîneur veut savoir si écouter de la musique améliore les performances. Il crée deux groupes : l'un s'entraîne avec musique, l'autre sans. Quelle est la Variable Indépendante (VI) ?",
    opts:["La performance mesurée","La présence ou absence de musique","Le groupe expérimental","La durée de l'entraînement"],
    ans:1, exp:"La VI est ce que l'expérimentateur MANIPULE = la musique (présence/absence). La VD = la performance mesurée." },
  { id:1002, c:1, type:"qcm", tag:"reformulé",
    q:"Un joueur de basket peut dribbler sans y penser tout en cherchant ses coéquipiers du regard. Quel type de mémoire permet ce geste automatique ?",
    opts:["Mémoire épisodique","Mémoire sémantique","Mémoire procédurale","Mémoire de travail"],
    ans:2, exp:"Le dribble automatique est stocké en mémoire procédurale (savoir-faire moteur). Elle ne nécessite pas de contrôle conscient." },
  { id:1003, c:3, type:"qcm", tag:"reformulé",
    q:"Un sportif participe à une compétition non pas pour la médaille, mais parce qu'il aime profondément son sport. Quelle forme de motivation illustre ce comportement ?",
    opts:["Motivation extrinsèque","Motivation homéostatique","Motivation intrinsèque","Motivation secondaire acquise"],
    ans:2, exp:"La motivation intrinsèque vient de l'intérieur : plaisir, passion, défi personnel. ≠ motivation extrinsèque (récompense externe)." },
  { id:1004, c:5, type:"qcm", tag:"reformulé",
    q:"Un jeune nageur apprend la nage papillon en regardant les vidéos de champions olympiques. Cette forme d'apprentissage correspond à :",
    opts:["Conditionnement classique (Pavlov)","Conditionnement opérant (Skinner)","Apprentissage vicariant (Bandura)","Constructivisme (Piaget)"],
    ans:2, exp:"Apprendre par observation d'un modèle = apprentissage vicariant de Bandura. Le nageur utilise les processus attentionnel + rétention + reproduction motrice." },
  { id:1005, c:2, type:"qcm", tag:"reformulé",
    q:"Un enfant de 4 ans pense que tout le monde voit la même chose que lui sur un dessin. Selon Piaget, il est au stade :",
    opts:["Sensori-moteur (0-2 ans)","Pré-opératoire (2-7 ans) — égocentrisme cognitif","Opérations concrètes (7-12 ans)","Opérations formelles (11+ ans)"],
    ans:1, exp:"Égocentrisme cognitif = stade pré-opératoire. L'enfant ne peut pas encore prendre le point de vue d'autrui. PAS un défaut moral." },
  { id:1006, c:4, type:"qcm", tag:"reformulé",
    q:"Un gardien de but expérimenté anticipe la direction du tir avant même que le joueur frappe. Quelle approche perceptive illustre ce phénomène ?",
    opts:["Bottom-up (Gibson) : le stimulus s'impose","Top-down (Bruner) : les connaissances guident la perception","Proprioception : sens de l'équilibre","Mémoire sensorielle"],
    ans:1, exp:"Top-down = les connaissances préalables (expérience, mémoire) s'imposent à l'environnement. Le gardien utilise ses schémas experts pour percevoir avant l'action." },

  // SYNTHÈSE / COMPARAISON
  { id:2001, c:5, type:"qcm", tag:"synthèse",
    q:"Quelle est la différence FONDAMENTALE entre Piaget et Vygotsky sur la relation apprentissage/développement ?",
    opts:[
      "Piaget pense que l'apprentissage tire le développement ; Vygotsky pense l'inverse",
      "Vygotsky pense que le développement précède l'apprentissage ; Piaget pense l'inverse",
      "Piaget pense que le développement précède l'apprentissage ; Vygotsky pense que l'apprentissage tire le développement",
      "Ils partagent exactement la même vision"
    ],
    ans:2, exp:"PIAGET : développement → apprentissage (maturation cognitive d'abord). VYGOTSKY : apprentissage → développement (l'apprentissage tire et accélère le développement via la ZPD)." },
  { id:2002, c:1, type:"qcm", tag:"synthèse",
    q:"Comparez mémoire déclarative et mémoire procédurale : laquelle est nécessaire pour se souvenir de la règle du hors-jeu au football ?",
    opts:["Mémoire procédurale","Mémoire déclarative (sémantique)","Mémoire sensorielle","Mémoire de travail"],
    ans:1, exp:"La règle du hors-jeu est un SAVOIR FACTUEL = mémoire déclarative sémantique. La mémoire procédurale, elle, stockerait le geste d'arbitrage ou la technique de course." },
  { id:2003, c:3, type:"qcm", tag:"synthèse",
    q:"Un coach attribue une prime à son joueur après chaque bonne performance. Selon Deci et Harlon, quel risque pédagogique cela représente-t-il ?",
    opts:[
      "Aucun risque, la récompense renforce toujours la motivation",
      "La récompense externe peut détruire la motivation intrinsèque du joueur",
      "Le joueur deviendra dépendant du sport",
      "Le joueur développera de l'anxiété compétitive"
    ],
    ans:1, exp:"Deci & Harlon : 'Le renforcement tue la motivation intrinsèque.' Si le joueur aimait le sport par passion, les primes l'amèneront à ne jouer QUE pour l'argent." },
  { id:2004, c:0, type:"qcm", tag:"synthèse",
    q:"En quoi la méthode expérimentale est-elle SUPÉRIEURE à la méthode clinique pour étudier les causes d'un comportement ?",
    opts:[
      "Elle est moins coûteuse",
      "Elle permet d'établir des RELATIONS DE CAUSE À EFFET en contrôlant les variables",
      "Elle s'applique à plus d'individus",
      "Elle est plus rapide"
    ],
    ans:1, exp:"La méthode expérimentale (VI→VD) permet d'établir des causalités. La méthode clinique décrit mais ne prouve pas la causalité." },
  { id:2005, c:2, type:"qcm", tag:"synthèse",
    q:"Quel concept de Piaget est DIRECTEMENT opposé à la réification de l'intelligence ?",
    opts:["L'assimilation","L'égocentrisme","La plasticité de l'intelligence (constructivisme)","La permanence de l'objet"],
    ans:2, exp:"Piaget montre que l'intelligence se CONSTRUIT progressivement par l'expérience → s'oppose à la réification (idée que l'intelligence est fixe et innée)." },

  // APPLICATIONS PRATIQUES SPORT / PÉDAGOGIE
  { id:3001, c:5, type:"qcm", tag:"application",
    q:"🏃 SITUATION SPORTIVE — Un préparateur physique veut que ses athlètes s'étirent systématiquement après l'entraînement. Il décide de NE PAS terminer la séance tant que les étirements ne sont pas faits. Quel mécanisme utilise-t-il ?",
    opts:["Renforcement positif","Punition positive","Renforcement négatif","Extinction"],
    ans:2, exp:"Renforcement négatif = retirer un stimulus DÉSAGRÉABLE (devoir rester) pour augmenter un comportement souhaité (s'étirer). ≠ punition qui DIMINUE un comportement." },
  { id:3002, c:3, type:"qcm", tag:"application",
    q:"🏅 SITUATION SPORTIVE — Un jeune athlète de haut niveau est sélectionné pour les JO mais son pays est en guerre et sa famille n'a pas de quoi manger. Selon Maslow, pourquoi sera-t-il probablement peu performant ?",
    opts:[
      "Son niveau de réalisation de soi est trop élevé",
      "Ses besoins physiologiques et de sécurité (base de pyramide) ne sont pas satisfaits",
      "Il manque de motivation intrinsèque",
      "Son attachement à sa famille est trop fort"
    ],
    ans:1, exp:"Maslow : les besoins de BASE (physiologiques + sécurité) doivent être satisfaits pour accéder aux niveaux supérieurs. Sans sécurité alimentaire/physique, la performance sportive est compromise." },
  { id:3003, c:1, type:"qcm", tag:"application",
    q:"📚 SITUATION PÉDAGOGIQUE — Pour aider ses étudiants à mémoriser les stades de Piaget, un prof leur demande de les réciter à voix haute, de les dessiner et de les expliquer à leur camarade. Selon Gates, pourquoi cette méthode est-elle efficace ?",
    opts:[
      "Car elle utilise la répétition mécanique",
      "Car elle utilise la récapitulation, le sur-apprentissage et le codage profond",
      "Car elle exploite la mémoire sensorielle",
      "Car elle renforce la mémoire épisodique uniquement"
    ],
    ans:1, exp:"Gates : les meilleures méthodes de mémorisation sont la récapitulation (feed-back), le sur-apprentissage et le codage PROFOND (expliquer = traitement profond > lecture passive)." },
  { id:3004, c:4, type:"qcm", tag:"application",
    q:"⚽ SITUATION SPORTIVE — Un entraîneur de football remarque que ses joueurs débutants ne voient pas les espaces libres sur le terrain, alors que ses joueurs experts les perçoivent immédiatement. Quelle explication psychologique est la plus juste ?",
    opts:[
      "Les experts ont une meilleure vue (physiologie supérieure)",
      "Les débutants ont une mémoire plus faible",
      "Les experts utilisent le Top-down : leur expérience guide leur perception",
      "Les débutants utilisent trop leur proprioception"
    ],
    ans:2, exp:"Top-down (Bruner) : l'expérience et les schémas cognitifs guident la perception. Les experts 'voient' plus vite car leur cerveau anticipe grâce aux connaissances stockées." },
  { id:3005, c:6, type:"qcm", tag:"application",
    q:"🌱 SITUATION PÉDAGOGIQUE — Un enseignant adapte ses exercices pour qu'ils soient légèrement plus difficiles que ce que l'élève sait déjà faire seul, mais réalisables avec un peu d'aide. Quel concept de Vygotsky applique-t-il ?",
    opts:["La maturation neurologique","La Zone Proximale de Développement (ZPD)","L'égocentrisme cognitif","L'étayage de Bruner"],
    ans:1, exp:"La ZPD = zone entre ce que l'élève peut faire seul et ce qu'il peut faire avec aide. C'est là que l'enseignement est OPTIMAL. Trop facile = ennui. Trop difficile = découragement." },
  { id:3006, c:2, type:"qcm", tag:"application",
    q:"🏊 SITUATION SPORTIVE — Un entraîneur de natation travaille avec des enfants de 6 ans. Il veut leur enseigner le concept abstrait de 'pression de l'eau'. Selon Piaget, pourquoi est-ce difficile à cet âge ?",
    opts:[
      "Les enfants de 6 ans ont une mémoire insuffisante",
      "À 6 ans (stade pré-opératoire), les enfants ne peuvent pas encore raisonner sur des concepts abstraits",
      "L'eau est trop complexe comme environnement",
      "La motivation intrinsèque fait défaut à cet âge"
    ],
    ans:1, exp:"Stade pré-opératoire (2-7 ans) : pensée concrète, pas encore d'opérations logiques abstraites. L'entraîneur devrait utiliser des démonstrations concrètes plutôt que des explications abstraites." },
  { id:3007, c:0, type:"qcm", tag:"application",
    q:"📊 SITUATION PÉDAGOGIQUE — Un chercheur veut tester si un programme de sophrologie réduit l'anxiété avant les compétitions. Il mesure l'anxiété AVANT et APRÈS le programme. Que sont 'le programme de sophrologie' et 'l'anxiété mesurée' ?",
    opts:[
      "VI = anxiété ; VD = sophrologie",
      "VI = sophrologie (cause manipulée) ; VD = anxiété (effet mesuré)",
      "Les deux sont des variables dépendantes",
      "Ce sont des hypothèses, pas des variables"
    ],
    ans:1, exp:"Méthode expérimentale : VI (cause manipulée) = le programme de sophrologie. VD (effet observé) = le niveau d'anxiété. La démarche vérifie si VI → VD." },
  { id:3008, c:5, type:"qcm", tag:"application",
    q:"🎾 SITUATION SPORTIVE — Un joueur de tennis perd un point et s'énerve. Son coach l'ignore (aucune réaction). Mais dès que le joueur garde son calme après une erreur, le coach le félicite. Quelle technique béhavioriste utilise le coach ?",
    opts:[
      "Conditionnement classique (Pavlov)",
      "Extinction du comportement négatif + renforcement positif du comportement souhaité",
      "Punition positive",
      "Apprentissage vicariant (Bandura)"
    ],
    ans:1, exp:"Ignorer = extinction (disparition d'un comportement non renforcé). Féliciter = renforcement positif. Double technique béhavioriste (Skinner) très utilisée en coaching sportif." },
];

const ALL_QUESTIONS = [...BASE_QUESTIONS, ...NEW_QUESTIONS];

function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// ─── THEME ───────────────────────────────────────────────────────────────────
const S = {
  bg:"#06080f", surface:"#0d1424", surface2:"#131c2e", border:"#1a2540",
  accent:"#6d28d9", accentLight:"#a78bfa", green:"#10b981", red:"#ef4444",
  yellow:"#f59e0b", textPrimary:"#f1f5f9", textSecondary:"#94a3b8", textMuted:"#4b5563",
};

const TAG_STYLES = {
  reformulé: { bg:"rgba(14,165,233,0.12)", color:"#38bdf8", border:"rgba(14,165,233,0.3)", label:"🔄 Reformulé" },
  synthèse:  { bg:"rgba(168,85,247,0.12)", color:"#c084fc", border:"rgba(168,85,247,0.3)", label:"🔗 Synthèse" },
  application:{ bg:"rgba(20,184,166,0.12)", color:"#2dd4bf", border:"rgba(20,184,166,0.3)", label:"🏃 Application" },
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function NavBar({ route, navigate }) {
  const tabs = [
    { id:"home", icon:"🏠", label:"Accueil" },
    { id:"quiz", icon:"🎯", label:"Quiz" },
    { id:"bio", icon:"👤", label:"Biographies" },
  ];
  return (
    <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(6,8,15,0.95)", backdropFilter:"blur(12px)", borderTop:`1px solid ${S.border}`, display:"flex", zIndex:100 }}>
      {tabs.map(t => {
        const active = route===t.id || (route.startsWith("quiz") && t.id==="quiz") || (route.startsWith("bio") && t.id==="bio");
        return (
          <button key={t.id} onClick={()=>navigate(t.id)} style={{ flex:1, padding:"10px 0 12px", background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:20, opacity:active?1:0.45, transition:"opacity .2s" }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:active?S.accentLight:S.textMuted, transition:"color .2s" }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ navigate }) {
  const newCount = NEW_QUESTIONS.length;
  const reformCount = NEW_QUESTIONS.filter(q=>q.tag==="reformulé").length;
  const synthCount  = NEW_QUESTIONS.filter(q=>q.tag==="synthèse").length;
  const appCount    = NEW_QUESTIONS.filter(q=>q.tag==="application").length;

  return (
    <div style={{ background:S.bg, minHeight:"100vh", padding:"32px 16px 80px", overflowY:"auto" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-block", background:"rgba(109,40,217,0.12)", border:"1px solid rgba(109,40,217,0.3)", borderRadius:100, padding:"5px 16px", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:S.accentLight, marginBottom:14 }}>
            PC1 STAPS — INJS
          </div>
          <h1 style={{ margin:"0 0 8px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(36px,8vw,64px)", lineHeight:1.05, color:"#fff" }}>
            Psycho<br/>
            <span style={{ background:"linear-gradient(135deg,#a78bfa,#2dd4bf)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>STAPS</span>
          </h1>
          <p style={{ color:S.textMuted, fontSize:14 }}>Révisez · Entraînez-vous · Progressez</p>
        </div>

        {/* Nouvelle section */}
        <div style={{ background:"linear-gradient(135deg,rgba(109,40,217,0.15),rgba(20,184,166,0.1))", border:"1px solid rgba(109,40,217,0.3)", borderRadius:20, padding:"20px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ fontSize:22 }}>✨</span>
            <div>
              <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:S.textPrimary, margin:0 }}>Nouvelles questions ({newCount})</p>
              <p style={{ fontSize:12, color:S.textMuted, margin:0 }}>Format examen enrichi</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[
              {tag:"reformulé",n:reformCount,style:TAG_STYLES.reformulé},
              {tag:"synthèse",n:synthCount,style:TAG_STYLES.synthèse},
              {tag:"application",n:appCount,style:TAG_STYLES.application},
            ].map(({tag,n,style})=>(
              <span key={tag} style={{ fontSize:12, fontWeight:700, padding:"5px 12px", borderRadius:100, background:style.bg, color:style.color, border:`1px solid ${style.border}` }}>
                {style.label} ×{n}
              </span>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display:"grid", gap:10, marginBottom:20 }}>
          <button onClick={()=>navigate("quiz")} style={{ padding:"17px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${S.accent},#4c1d95)`, color:"#fff", fontSize:16, fontWeight:800, fontFamily:"'Syne',sans-serif", cursor:"pointer", boxShadow:"0 8px 24px rgba(109,40,217,0.35)", letterSpacing:"0.03em" }}>
            🎯 Commencer le Quiz →
          </button>
          <button onClick={()=>navigate("bio")} style={{ padding:"15px", borderRadius:16, border:`1px solid ${S.border}`, background:S.surface, color:S.textPrimary, fontSize:14, fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer" }}>
            👤 Voir les Biographies
          </button>
        </div>

        {/* Stats chapitres */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8 }}>
          {CHAPTERS.map(ch=>{
            const total=ALL_QUESTIONS.filter(q=>q.c===ch.id).length;
            return(
              <div key={ch.id} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:"14px 12px" }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{ch.icon}</div>
                <div style={{ fontSize:12, fontWeight:600, color:S.textSecondary, lineHeight:1.3, marginBottom:3 }}>{ch.label}</div>
                <div style={{ fontSize:11, color:S.textMuted }}>{total} questions</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── WELCOME QUIZ ─────────────────────────────────────────────────────────────
function WelcomeQuiz({ onStart, onBack }) {
  const [sel, setSel] = useState(new Set([0,1,2,3,4,5,6]));
  const [includeNew, setIncludeNew] = useState(true);
  const toggle = id => setSel(p=>{const s=new Set(p);s.has(id)?s.delete(id):s.add(id);return s;});

  const pool = ALL_QUESTIONS.filter(q=>{
    if(!sel.has(q.c)) return false;
    if(!includeNew && q.tag) return false;
    return true;
  });

  const reformCount = pool.filter(q=>q.tag==="reformulé").length;
  const synthCount  = pool.filter(q=>q.tag==="synthèse").length;
  const appCount    = pool.filter(q=>q.tag==="application").length;

  return (
    <div style={{ background:S.bg, minHeight:"100vh", overflowY:"auto", padding:"24px 16px 80px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <button onClick={onBack} style={{ background:"transparent", border:"none", color:S.textMuted, fontSize:14, cursor:"pointer", marginBottom:16, display:"flex", alignItems:"center", gap:6 }}>← Retour</button>

        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:"#fff", margin:"0 0 20px" }}>
          🎯 Configurer le Quiz
        </h2>

        {/* Type filter */}
        <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:"16px", marginBottom:14 }}>
          <p style={{ fontSize:12, fontWeight:700, color:S.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Types de questions</p>
          <button onClick={()=>setIncludeNew(!includeNew)} style={{ display:"flex", alignItems:"center", gap:12, width:"100%", background:"transparent", border:"none", cursor:"pointer", padding:0 }}>
            <div style={{ width:36, height:20, borderRadius:100, background:includeNew?S.accent:S.border, transition:"background .2s", flexShrink:0, position:"relative" }}>
              <div style={{ position:"absolute", top:2, left:includeNew?18:2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
            </div>
            <div style={{ textAlign:"left" }}>
              <p style={{ color:S.textPrimary, fontWeight:600, fontSize:13, margin:0 }}>Inclure les nouvelles questions</p>
              <p style={{ color:S.textMuted, fontSize:11, margin:0 }}>Reformulées · Synthèse · Applications pratiques</p>
            </div>
          </button>
          {includeNew && (
            <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
              {[
                {tag:"reformulé",n:reformCount,style:TAG_STYLES.reformulé},
                {tag:"synthèse",n:synthCount,style:TAG_STYLES.synthèse},
                {tag:"application",n:appCount,style:TAG_STYLES.application},
              ].filter(x=>x.n>0).map(({tag,n,style})=>(
                <span key={tag} style={{ fontSize:11, padding:"3px 10px", borderRadius:100, background:style.bg, color:style.color, border:`1px solid ${style.border}` }}>
                  {style.label} ×{n}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Select all/none */}
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          {[["Tout",()=>setSel(new Set([0,1,2,3,4,5,6]))],["Rien",()=>setSel(new Set())]].map(([lbl,fn])=>(
            <button key={lbl} onClick={fn} style={{ background:"transparent", border:`1px solid ${S.border}`, borderRadius:100, padding:"6px 14px", color:S.textMuted, fontSize:12, fontWeight:600, cursor:"pointer" }}>{lbl}</button>
          ))}
        </div>

        {/* Chapters */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8, marginBottom:16 }}>
          {CHAPTERS.map(ch=>{
            const active=sel.has(ch.id);
            const cnt=ALL_QUESTIONS.filter(q=>q.c===ch.id&&(includeNew||!q.tag)).length;
            return(
              <button key={ch.id} onClick={()=>toggle(ch.id)} style={{ position:"relative", background:active?"rgba(109,40,217,0.1)":S.surface, border:`1px solid ${active?"rgba(109,40,217,0.5)":S.border}`, borderRadius:14, padding:"14px 12px 12px", cursor:"pointer", textAlign:"left" }}>
                <div style={{ position:"absolute", top:8, right:8, width:18, height:18, borderRadius:"50%", background:active?S.accent:"transparent", border:`1px solid ${active?S.accent:S.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", fontWeight:800 }}>{active?"✓":""}</div>
                <div style={{ fontSize:22, marginBottom:4 }}>{ch.icon}</div>
                <div style={{ fontSize:12, fontWeight:600, color:active?S.textPrimary:S.textMuted, lineHeight:1.3 }}>{ch.label}</div>
                <div style={{ fontSize:11, color:S.textMuted, marginTop:2 }}>{cnt} q.</div>
              </button>
            );
          })}
        </div>

        <p style={{ textAlign:"center", color:S.textMuted, fontSize:13, marginBottom:14 }}>{pool.length} question{pool.length>1?"s":""}</p>
        <button disabled={pool.length===0} onClick={()=>onStart(pool)} style={{ display:"block", width:"100%", padding:"15px", borderRadius:14, border:"none", background:pool.length===0?S.surface2:`linear-gradient(135deg,${S.accent},#4c1d95)`, color:pool.length===0?S.textMuted:"#fff", fontSize:16, fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:pool.length===0?"not-allowed":"pointer", boxShadow:pool.length>0?"0 4px 20px rgba(109,40,217,0.3)":"none" }}>
          Commencer →
        </button>
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
function Quiz({ questions, onFinish, onBack }) {
  const [idx,setIdx]=useState(0);
  const [lives,setLives]=useState(5);
  const [scoreRaw,setScoreRaw]=useState(0);
  const [correctCount,setCorrectCount]=useState(0);
  const [wrongCount,setWrongCount]=useState(0);
  const [skippedCount,setSkippedCount]=useState(0);
  const [answered,setAnswered]=useState(false);
  const [feedback,setFeedback]=useState(null);
  const [chosen,setChosen]=useState(null);
  const [defText,setDefText]=useState("");
  const [key,setKey]=useState(0);

  const q=questions[idx];
  const chap=CHAPTERS.find(c=>c.id===q?.c);
  const pct=Math.round((idx/questions.length)*100);
  const LETTERS=["A","B","C","D"];

  const advance=useCallback((nl,nc,nw,ns2,score)=>{
    if(nl<=0){setTimeout(()=>onFinish({lives:0,correctCount:nc,wrongCount:nw,skippedCount:ns2,scoreRaw:score,total:questions.length}),900);return;}
    const nxt=idx+1;
    if(nxt>=questions.length){onFinish({lives:nl,correctCount:nc,wrongCount:nw,skippedCount:ns2,scoreRaw:score,total:questions.length});return;}
    setTimeout(()=>{setIdx(nxt);setAnswered(false);setFeedback(null);setChosen(null);setDefText("");setKey(k=>k+1);},1500);
  },[idx,questions.length,onFinish]);

  const doCorrect=useCallback(()=>{
    const nc=correctCount+1,score=scoreRaw+1;
    setCorrectCount(nc);setScoreRaw(score);
    setFeedback({type:"ok",msg:"✅ Bonne réponse ! +1 point",exp:q.exp});
    advance(lives,nc,wrongCount,skippedCount,score);
  },[q,lives,correctCount,wrongCount,skippedCount,scoreRaw,advance]);

  const doWrong=useCallback(()=>{
    const nl=lives-1,nw=wrongCount+1,score=scoreRaw-0.5;
    setLives(nl);setWrongCount(nw);setScoreRaw(score);
    setFeedback({type:"bad",msg:`❌ Mauvaise réponse — −0,5 pt  ❤️ ${nl}/5`,exp:q.exp});
    advance(nl,correctCount,nw,skippedCount,score);
  },[q,lives,correctCount,wrongCount,skippedCount,scoreRaw,advance]);

  const doSkip=useCallback(()=>{
    if(answered)return;setAnswered(true);
    const ns2=skippedCount+1;setSkippedCount(ns2);
    setFeedback({type:"skip",msg:"⏭ Question passée — 0 point",exp:q.exp});
    advance(lives,correctCount,wrongCount,ns2,scoreRaw);
  },[answered,q,lives,correctCount,wrongCount,skippedCount,scoreRaw,advance]);

  const ansQCM=i=>{if(answered)return;setAnswered(true);setChosen(i);if(i===q.ans)doCorrect();else doWrong();};
  const ansVF=v=>{if(answered)return;setAnswered(true);setChosen(v);if(v===q.ans)doCorrect();else doWrong();};
  const ansDef=()=>{
    if(answered||!defText.trim())return;setAnswered(true);
    const lower=defText.toLowerCase();
    const found=q.keywords.filter(k=>lower.includes(k.toLowerCase()));
    if(found.length/q.keywords.length>=0.4)doCorrect();else doWrong();
  };

  if(!q)return null;

  const fbStyle=feedback?{
    ok:{bg:"rgba(16,185,129,0.1)",border:"rgba(16,185,129,0.3)",color:"#34d399"},
    bad:{bg:"rgba(239,68,68,0.1)",border:"rgba(239,68,68,0.3)",color:"#f87171"},
    skip:{bg:"rgba(245,158,11,0.1)",border:"rgba(245,158,11,0.3)",color:"#fbbf24"},
  }[feedback.type]:null;

  const typeBadge={
    qcm:{bg:"rgba(109,40,217,0.15)",color:"#a78bfa",border:"rgba(109,40,217,0.3)",label:"QCM"},
    vf:{bg:"rgba(16,185,129,0.12)",color:"#34d399",border:"rgba(16,185,129,0.25)",label:"VRAI / FAUX"},
    def:{bg:"rgba(245,158,11,0.12)",color:"#fbbf24",border:"rgba(245,158,11,0.25)",label:"DÉFINITION"},
  }[q.type];

  const tagStyle=q.tag?TAG_STYLES[q.tag]:null;

  return(
    <div style={{background:S.bg,minHeight:"100vh",overflowY:"auto",padding:"16px 14px 80px"}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        {/* HUD */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{display:"flex",gap:4,flexShrink:0}}>
            {[...Array(5)].map((_,i)=>(
              <span key={i} style={{fontSize:16,opacity:i<lives?1:0.18,transition:"all .25s"}}>❤️</span>
            ))}
          </div>
          <div style={{flex:1,height:5,background:S.surface2,borderRadius:100,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${S.accent},${S.accentLight})`,borderRadius:100,transition:"width .5s ease"}}/>
          </div>
          <span style={{fontSize:12,color:S.textMuted,whiteSpace:"nowrap",flexShrink:0}}>{idx+1}/{questions.length}</span>
        </div>

        {/* Card */}
        <div key={key} style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:20,padding:"18px 16px",marginBottom:10,animation:"fadeUp .25s ease"}}>
          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:7,marginBottom:12}}>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 11px",borderRadius:100,background:typeBadge.bg,color:typeBadge.color,border:`1px solid ${typeBadge.border}`}}>{typeBadge.label}</span>
            {tagStyle&&<span style={{fontSize:10,fontWeight:700,padding:"3px 11px",borderRadius:100,background:tagStyle.bg,color:tagStyle.color,border:`1px solid ${tagStyle.border}`}}>{tagStyle.label}</span>}
            <span style={{fontSize:11,color:S.textMuted,marginLeft:"auto"}}>{chap.icon} {chap.label}</span>
          </div>

          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"clamp(13px,3.2vw,16px)",color:S.textPrimary,lineHeight:1.55,marginBottom:16}}>{q.q}</p>

          {q.type==="qcm"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {q.opts.map((opt,i)=>{
                let bg=S.surface2,border=`1px solid ${S.border}`,color=S.textSecondary;
                if(answered){
                  if(i===q.ans){bg="rgba(16,185,129,0.1)";border="1px solid #10b981";color="#34d399";}
                  else if(i===chosen){bg="rgba(239,68,68,0.1)";border="1px solid #ef4444";color="#f87171";}
                }
                return(
                  <button key={i} disabled={answered} onClick={()=>ansQCM(i)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 13px",background:bg,border,borderRadius:12,color,fontSize:13,fontWeight:500,textAlign:"left",cursor:answered?"default":"pointer",transition:"all .15s"}}>
                    <span style={{width:24,height:24,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:answered&&i===q.ans?"#10b981":answered&&i===chosen?"#ef4444":"rgba(255,255,255,0.05)",color:answered&&(i===q.ans||i===chosen)?"#fff":S.textMuted,border:answered&&i===q.ans?"1px solid #10b981":answered&&i===chosen?"1px solid #ef4444":`1px solid ${S.border}`}}>{LETTERS[i]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {q.type==="vf"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[true,false].map(val=>{
                const isAns=val===q.ans,isCho=val===chosen;
                let bg=S.surface2,border=`1px solid ${S.border}`,color=S.textSecondary;
                if(answered){
                  if(isAns){bg="rgba(16,185,129,0.1)";border="1px solid #10b981";color="#34d399";}
                  else if(isCho){bg="rgba(239,68,68,0.1)";border="1px solid #ef4444";color="#f87171";}
                }
                return(
                  <button key={String(val)} disabled={answered} onClick={()=>ansVF(val)} style={{padding:"16px 8px",borderRadius:14,border,background:bg,color,fontSize:14,fontWeight:800,fontFamily:"'Syne',sans-serif",cursor:answered?"default":"pointer",transition:"all .15s"}}>
                    {val?"✅ VRAI":"❌ FAUX"}
                  </button>
                );
              })}
            </div>
          )}

          {q.type==="def"&&(
            <div>
              <textarea value={defText} onChange={e=>setDefText(e.target.value)} disabled={answered} placeholder="Rédigez votre définition ici…" style={{width:"100%",minHeight:80,background:S.surface2,border:`1px solid ${S.border}`,borderRadius:12,padding:"11px 13px",color:S.textPrimary,fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
              {!answered&&(
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button onClick={ansDef} disabled={!defText.trim()} style={{flex:1,padding:"11px",borderRadius:12,border:"none",background:defText.trim()?`linear-gradient(135deg,${S.accent},#4c1d95)`:S.surface2,color:defText.trim()?"#fff":S.textMuted,fontSize:13,fontWeight:700,cursor:defText.trim()?"pointer":"not-allowed"}}>✅ Valider</button>
                  <button onClick={doSkip} style={{flex:1,padding:"11px",borderRadius:12,border:`1px solid ${S.border}`,background:S.surface,color:S.textMuted,fontSize:13,fontWeight:600,cursor:"pointer"}}>⏭ Passer</button>
                </div>
              )}
              {answered&&(
                <div style={{marginTop:10,padding:"12px",background:S.surface2,border:`1px solid ${S.border}`,borderRadius:12}}>
                  <p style={{fontSize:11,fontWeight:700,color:S.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>📖 Réponse modèle</p>
                  <p style={{fontSize:12,color:S.textSecondary,lineHeight:1.6,margin:0}}>{q.answer}</p>
                </div>
              )}
            </div>
          )}

          {feedback&&fbStyle&&(
            <div style={{marginTop:12,padding:"12px 14px",borderRadius:14,background:fbStyle.bg,border:`1px solid ${fbStyle.border}`}}>
              <p style={{color:fbStyle.color,fontWeight:700,fontSize:13,margin:"0 0 3px"}}>{feedback.msg}</p>
              <p style={{color:S.textMuted,fontSize:12,lineHeight:1.5,margin:0}}>{feedback.exp}</p>
            </div>
          )}
        </div>

        {!answered&&q.type!=="def"&&(
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button onClick={doSkip} style={{padding:"7px 16px",borderRadius:12,border:`1px solid ${S.border}`,background:S.surface,color:S.textMuted,fontSize:12,fontWeight:600,cursor:"pointer"}}>⏭ Passer</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
function Results({ result, onReplay, onHome }) {
  const {lives,correctCount,wrongCount,skippedCount,scoreRaw,total}=result;
  const pct=total?Math.round((correctCount/total)*100):0;
  const note20=total?Math.max(0,Math.min(20,(Math.max(0,scoreRaw)/total)*20)):0;
  const note20str=Number.isInteger(note20)?note20:note20.toFixed(1);
  const mention=note20>=16?{text:"Très bien 🎉",c:"#34d399"}:note20>=14?{text:"Bien 😊",c:"#34d399"}:note20>=12?{text:"Assez bien 👍",c:"#fbbf24"}:note20>=10?{text:"Passable 😐",c:"#fb923c"}:{text:"À retravailler 📖",c:"#f87171"};
  const noteColor=note20>=12?"#34d399":note20>=8?"#fbbf24":"#f87171";
  const r=52,circ=2*Math.PI*r;
  const ringColor=pct>=75?"#34d399":pct>=50?"#fbbf24":"#f87171";
  const lost=lives<=0;

  return(
    <div style={{background:S.bg,minHeight:"100vh",overflowY:"auto",padding:"40px 16px 80px"}}>
      <div style={{maxWidth:420,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:10}}>{lost?"💔":pct>=75?"🏆":pct>=50?"👏":"📖"}</div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(22px,7vw,40px)",color:"#fff",margin:"0 0 6px"}}>
          {lost?"Game Over !":pct>=75?"Excellent !":pct>=50?"Bien joué !":"Continue !"}
        </h2>
        <div style={{marginBottom:4}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:52,color:noteColor}}>{note20str}</span>
          <span style={{fontWeight:700,fontSize:20,color:S.textMuted}}>/20</span>
        </div>
        <p style={{fontSize:15,fontWeight:700,color:mention.c,marginBottom:24}}>{mention.text}</p>

        <div style={{position:"relative",width:130,height:130,margin:"0 auto 24px"}}>
          <svg viewBox="0 0 120 120" style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
            <circle cx="60" cy="60" r={r} fill="none" stroke={S.surface2} strokeWidth="9"/>
            <circle cx="60" cy="60" r={r} fill="none" stroke={ringColor} strokeWidth="9" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-(circ*pct/100)} style={{transition:"stroke-dashoffset 1.2s ease"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:ringColor}}>{pct}%</span>
            <span style={{fontSize:11,color:S.textMuted}}>{correctCount}/{total}</span>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:24}}>
          {[
            {v:correctCount,l:"Bonnes",c:"#34d399",i:"✅"},
            {v:wrongCount,l:"Mauvaises",c:"#f87171",i:"❌"},
            {v:skippedCount,l:"Passées",c:"#fbbf24",i:"⏭"},
          ].map(s=>(
            <div key={s.l} style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:14,padding:"14px 8px"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:s.c}}>{s.v}</div>
              <div style={{fontSize:11,color:S.textMuted,marginTop:2}}>{s.i} {s.l}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gap:10}}>
          <button onClick={onReplay} style={{padding:"14px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${S.accent},#4c1d95)`,color:"#fff",fontSize:15,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:"pointer",boxShadow:"0 4px 20px rgba(109,40,217,0.3)"}}>
            🔄 Rejouer
          </button>
          <button onClick={onHome} style={{padding:"13px",borderRadius:14,border:`1px solid ${S.border}`,background:S.surface,color:S.textSecondary,fontSize:14,fontWeight:600,cursor:"pointer"}}>
            🏠 Accueil
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BIOGRAPHIES ──────────────────────────────────────────────────────────────
function Biographies({ navigate }) {
  const [selected, setSelected] = useState(null);

  if(selected){
    const b=selected;
    return(
      <div style={{background:S.bg,minHeight:"100vh",overflowY:"auto",padding:"20px 16px 80px"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <button onClick={()=>setSelected(null)} style={{background:"transparent",border:"none",color:S.textMuted,fontSize:14,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",gap:6}}>← Retour</button>

          {/* Hero */}
          <div style={{background:`linear-gradient(135deg,${b.color}22,${b.color}08)`,border:`1px solid ${b.color}44`,borderRadius:24,padding:"24px 20px",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
              <div style={{width:64,height:64,borderRadius:20,background:`linear-gradient(135deg,${b.color},${b.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:"#fff",flexShrink:0}}>
                {b.avatar}
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:18}}>{b.flag}</span>
                  <span style={{fontSize:12,color:S.textMuted}}>{b.dates}</span>
                </div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#fff",margin:0,lineHeight:1.2}}>{b.name}</h2>
                <p style={{fontSize:12,color:b.color,fontWeight:600,margin:"4px 0 0"}}>{b.role}</p>
              </div>
            </div>

            {/* Quote */}
            <div style={{borderLeft:`3px solid ${b.color}`,paddingLeft:14,marginBottom:0}}>
              <p style={{fontSize:13,fontStyle:"italic",color:S.textSecondary,margin:0,lineHeight:1.6}}>« {b.quote} »</p>
            </div>
          </div>

          {/* Facts */}
          <div style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:20,padding:"18px",marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:700,color:S.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Points clés à retenir</p>
            {b.facts.map((f,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:12}}>
                <div style={{width:24,height:24,borderRadius:8,background:`${b.color}22`,border:`1px solid ${b.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:800,color:b.color}}>{i+1}</div>
                <p style={{fontSize:13,color:S.textSecondary,lineHeight:1.5,margin:0}}>{f}</p>
              </div>
            ))}
          </div>

          {/* Chapitres liés */}
          <div style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:20,padding:"16px"}}>
            <p style={{fontSize:11,fontWeight:700,color:S.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Chapitres du cours</p>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {b.chapters.map(cId=>{
                const ch=CHAPTERS.find(c=>c.id===cId);
                return ch?(
                  <span key={cId} style={{fontSize:12,padding:"6px 14px",borderRadius:100,background:"rgba(109,40,217,0.12)",border:"1px solid rgba(109,40,217,0.3)",color:S.accentLight,fontWeight:600}}>
                    {ch.icon} {ch.label}
                  </span>
                ):null;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{background:S.bg,minHeight:"100vh",overflowY:"auto",padding:"24px 16px 80px"}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:"#fff",margin:"0 0 6px"}}>👤 Biographies</h2>
        <p style={{color:S.textMuted,fontSize:13,marginBottom:20}}>Les auteurs clés de votre cours</p>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {BIOGRAPHIES.map(b=>(
            <button key={b.id} onClick={()=>setSelected(b)} style={{background:S.surface,border:`1px solid ${S.border}`,borderRadius:18,padding:"16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left",transition:"border-color .2s",width:"100%"}}>
              <div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${b.color},${b.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,color:"#fff",flexShrink:0}}>
                {b.avatar}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:S.textPrimary}}>{b.name}</span>
                  <span style={{fontSize:13}}>{b.flag}</span>
                </div>
                <p style={{fontSize:11,color:S.textMuted,margin:0,lineHeight:1.4}}>{b.dates} · {b.role}</p>
                <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>
                  {b.chapters.map(cId=>{
                    const ch=CHAPTERS.find(c=>c.id===cId);
                    return ch?<span key={cId} style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:"rgba(109,40,217,0.1)",color:S.accentLight,fontWeight:600}}>{ch.icon} {ch.label}</span>:null;
                  })}
                </div>
              </div>
              <span style={{color:S.textMuted,fontSize:18}}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP (ROUTER) ─────────────────────────────────────────────────────────────
export default function App() {
  const { route, navigate } = useRouter();
  const [quizScreen, setQuizScreen] = useState("config"); // config | playing | results
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  const handleStartQuiz = (pool) => {
    setQuizQuestions(shuffle(pool));
    setQuizScreen("playing");
  };

  const handleFinishQuiz = (result) => {
    setQuizResult(result);
    setQuizScreen("results");
  };

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; background: #06080f; }
        button { font-family: 'Nunito', sans-serif; }
        textarea { font-family: 'Nunito', sans-serif; }
      `}</style>

      {/* Pages */}
      {route === "home" && <Home navigate={navigate} />}
      {route === "bio"  && <Biographies navigate={navigate} />}
      {route === "quiz" && quizScreen === "config"  && <WelcomeQuiz onStart={handleStartQuiz} onBack={()=>navigate("home")} />}
      {route === "quiz" && quizScreen === "playing" && <Quiz questions={quizQuestions} onFinish={handleFinishQuiz} onBack={()=>setQuizScreen("config")} />}
      {route === "quiz" && quizScreen === "results" && <Results result={quizResult} onReplay={()=>setQuizScreen("config")} onHome={()=>navigate("home")} />}

      {/* Navigation bar */}
      {quizScreen !== "playing" && <NavBar route={route} navigate={(r)=>{ navigate(r); if(r==="quiz") setQuizScreen("config"); }} />}
    </>
  );
}