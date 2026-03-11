import { useState, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const CHAPTERS = [
  { id: 0, label: "Généralités",    icon: "🧠" },
  { id: 1, label: "La Mémoire",     icon: "💾" },
  { id: 2, label: "L'Intelligence", icon: "⚡" },
  { id: 3, label: "La Motivation",  icon: "🔥" },
  { id: 4, label: "La Perception",  icon: "👁️" },
  { id: 5, label: "Apprentissage",  icon: "📚" },
  { id: 6, label: "Développement",  icon: "🌱" },
];

const ALL_QUESTIONS = [
  // ── CHAP 0 ──
  { id:1,  c:0, type:"qcm", q:"Que signifie 'psychologie' d'après son étymologie grecque ?", opts:["Science du corps","Science de l'âme et de l'esprit","Science du comportement observable","Science de la société"], ans:1, exp:"Du grec psychê (âme/esprit) + logos (science). Wundt l'a transformée en science expérimentale en 1879." },
  { id:2,  c:0, type:"qcm", q:"Qui a créé le premier laboratoire de psychologie expérimentale et en quelle année ?", opts:["Freud à Vienne en 1895","Watson à Chicago en 1913","Wundt à Leipzig en 1879","Pavlov à Saint-Pétersbourg en 1890"], ans:2, exp:"Wilhelm Wundt (1832-1920) fonda le 1er laboratoire à Leipzig en 1879." },
  { id:3,  c:0, type:"qcm", q:"Selon Watson (1913), quel est l'objet de la psychologie ?", opts:["L'étude de l'inconscient","L'étude de ce que font les êtres vivants de leur naissance à leur mort","L'étude des processus mentaux internes","L'étude des émotions et de la personnalité"], ans:1, exp:"Watson (1913) : psychologie = science de l'adaptation des faits humains de la naissance à la mort." },
  { id:4,  c:0, type:"qcm", q:"Quelles sont les 3 méthodes de la psychologie selon le cours ?", opts:["Observation, expérimentation, questionnaire","Introspective, clinique et expérimentale","Qualitative, quantitative et mixte","Béhavioriste, cognitive et psychanalytique"], ans:1, exp:"Les 3 méthodes : introspective (observation de soi), clinique (questionnaire, entretien, test) et expérimentale." },
  { id:5,  c:0, type:"qcm", q:"Dans la méthode expérimentale, qu'est-ce que la Variable Indépendante (VI) ?", opts:["L'effet observé","La cause manipulée par l'expérimentateur","La réponse du sujet","Le comportement mesuré"], ans:1, exp:"VI = cause manipulée. VD (Variable Dépendante) = effet observé/mesuré." },
  { id:6,  c:0, type:"qcm", q:"Combien d'étapes comporte la démarche expérimentale ?", opts:["2","3","4","5"], ans:2, exp:"4 étapes : formulation du problème → hypothèse → mise à l'épreuve → conclusion." },
  { id:7,  c:0, type:"qcm", q:"Qui est le pionnier de la psychologie du sport en France ?", opts:["Wilhelm Wundt","Sigmund Freud","Georges Rioux","Jean Piaget"], ans:2, exp:"Georges Rioux, professeur à l'Université de Tours, pionnier de la psychologie du sport en France." },
  { id:8,  c:0, type:"qcm", q:"Quelle critique principale fait-on à la méthode introspective ?", opts:["Elle est trop coûteuse","Les informations sont subjectives et non vérifiables","Elle ne peut pas étudier les adultes","Elle nécessite des instruments complexes"], ans:1, exp:"L'introspection est subjective : un observateur ne peut vérifier ce que le sujet rapporte." },
  { id:9,  c:0, type:"qcm", q:"Les 3 caractéristiques essentielles d'un test psychologique sont :", opts:["Fiabilité, validité, sensibilité","Objectivité, subjectivité, neutralité","Rapidité, précision, économie","Standardisation, normalisation, étalonnage"], ans:0, exp:"Un bon test : fidèle (mêmes résultats si repassé), valide (mesure ce qu'il prétend mesurer), sensible (différencie les individus)." },
  { id:10, c:0, type:"qcm", q:"Jusqu'à quand la psychologie était-elle une branche de la philosophie ?", opts:["Jusqu'en 1700","Jusqu'en 1870","Jusqu'en 1913","Jusqu'en 1950"], ans:1, exp:"Jusqu'en 1870, la psychologie s'inscrivait dans l'histoire de la philosophie. C'est Wundt en 1879 qui lui donna le statut de science." },
  { id:11, c:0, type:"qcm", q:"Combien de types d'entretien existent dans la méthode clinique ?", opts:["1","2","3","4"], ans:2, exp:"3 types d'entretien : directif, semi-directif, non directif." },
  { id:12, c:0, type:"qcm", q:"Le principe de déterminisme causal signifie :", opts:["Tout est aléatoire","Tout effet est produit par une cause","La liberté détermine le comportement","L'environnement seul explique tout"], ans:1, exp:"Déterminisme causal : tout effet est produit par une cause (base de la méthode expérimentale)." },
  { id:13, c:0, type:"vf",  q:"La psychologie béhavioriste étudie principalement les processus inconscients.", ans:false, exp:"Faux. Le béhaviorisme (Watson) étudie UNIQUEMENT les comportements observables et mesurables. L'inconscient, c'est la psychanalyse." },
  { id:14, c:0, type:"vf",  q:"Jusqu'en 1870, la psychologie était considérée comme une branche de la philosophie.", ans:true,  exp:"Vrai. De l'Antiquité jusqu'en 1870, la psychologie s'inscrivait dans l'histoire de la philosophie." },
  { id:15, c:0, type:"vf",  q:"L'hypothèse est une affirmation définitive et prouvée sur un comportement.", ans:false, exp:"Faux. L'hypothèse est une réponse anticipée et PROVISOIRE. Elle doit être testée et peut être confirmée ou infirmée." },
  { id:16, c:0, type:"vf",  q:"Wundt est à la fois philosophe et fondateur de la psychologie expérimentale.", ans:true,  exp:"Vrai. Wundt était philosophe qui a rendu scientifique l'étude du comportement humain via des études sur la perception." },
  { id:17, c:0, type:"def", q:"Définissez la PSYCHOLOGIE selon le cours.", answer:"La psychologie est la science qui étudie le comportement des individus et leurs processus mentaux (intelligence, langage, mémoire). Elle recouvre théories, pratiques, méthodes et expériences. Son objet est le comportement humain sous tous ses aspects psychiques, normaux ou pathologiques.", keywords:["comportement","processus mentaux","science","individus","normaux","pathologiques"], exp:"Étymologie : psychê (âme) + logos (science)." },
  { id:18, c:0, type:"def", q:"Définissez la MÉTHODE EXPÉRIMENTALE en psychologie.", answer:"Méthode fondée sur le principe du déterminisme causal. L'expérimentateur manipule des variables indépendantes (VI) et observe leurs effets sur la variable dépendante (VD). 4 étapes : formulation d'un problème, élaboration d'une hypothèse, mise à l'épreuve, formulation de la conclusion.", keywords:["déterminisme causal","variable indépendante","variable dépendante","hypothèse","4 étapes"], exp:"Observation = phénomène naturel. Expérimentation = phénomène provoqué." },
  // ── CHAP 1 ──
  { id:100, c:1, type:"qcm", q:"Quelles sont les 3 étapes de la mémoire comme système de traitement ?", opts:["Attention, perception, mémorisation","Encodage, rétention/stockage, récupération","Apprentissage, consolidation, oubli","Codage, décodage, rappel"], ans:1, exp:"Encodage → Rétention/Stockage → Récupération. Modèle de la mémoire comme système de traitement." },
  { id:101, c:1, type:"qcm", q:"Quelle mémoire stocke les savoir-faire et gestes automatisés ?", opts:["Mémoire épisodique","Mémoire sémantique","Mémoire procédurale","Mémoire sensorielle"], ans:2, exp:"La mémoire procédurale stocke les capacités perceptuelles, cognitives et motrices. Une fois acquise, fonctionne sans effort conscient." },
  { id:102, c:1, type:"qcm", q:"Combien de temps dure environ la mémoire sensorielle ?", opts:["0,5 seconde","5 secondes","30 secondes","5 minutes"], ans:0, exp:"La mémoire sensorielle maintient l'information environ 0,5 seconde. Iconique (vision) et échoïque (audition)." },
  { id:103, c:1, type:"qcm", q:"Selon Paivio (1976), les informations sont représentées de combien de façons ?", opts:["1 (uniquement verbale)","2 (code image et code verbal)","3 (visuelle, auditive, kinesthésique)","4"], ans:1, exp:"Théorie du double codage (Paivio) : code image (concret) + code verbal (abstrait). Plus un mot est abstrait, moins il est retenu." },
  { id:104, c:1, type:"qcm", q:"Quel neurotransmetteur est déficient dans la maladie d'Alzheimer ?", opts:["Dopamine","Sérotonine","Acétylcholine","Adrénaline"], ans:2, exp:"L'acétylcholine est crucial pour la mémoire. La maladie d'Alzheimer est due à une pénurie d'acétylcholine." },
  { id:105, c:1, type:"qcm", q:"Quelle structure cérébrale est impliquée dans l'encodage de la mémoire déclarative ?", opts:["Le cortex frontal","L'hippocampe","Le cervelet","Le cortex moteur"], ans:1, exp:"L'hippocampe (lobe temporal médian) : encodage, consolidation, rappel des souvenirs déclaratifs." },
  { id:106, c:1, type:"qcm", q:"Selon Gates (1968), quelle est la principale façon d'améliorer la mémoire ?", opts:["La mémorisation mécanique","La récapitulation (feed-back)","La relecture passive","L'apprentissage incident"], ans:1, exp:"Gates (1968) : récapitulation (feed-back), sélection (attention), sur-apprentissage (répétition), codage profond, sommeil." },
  { id:107, c:1, type:"qcm", q:"L'oubli selon Freud est souvent le résultat de :", opts:["Manque de répétition","Codage trop superficiel","Refoulement inconscient","Interférence proactive"], ans:2, exp:"Pour Freud, on oublie inconsciemment ce qui est douloureux ou conflictuel : c'est le refoulement." },
  { id:108, c:1, type:"qcm", q:"Quelle pathologie touche les alcooliques chroniques et l'hippocampe ?", opts:["Alzheimer","Prosopagnosie","Amnésie de Korsakoff","Acalculie"], ans:2, exp:"L'amnésie de Korsakoff (alcooliques chroniques) touche toutes les zones du cerveau, surtout l'hippocampe." },
  { id:109, c:1, type:"qcm", q:"La prosopagnosie est due à :", opts:["Une lésion de l'hippocampe","Une lésion de l'hémisphère droit","Un manque d'acétylcholine","Un abus d'alcool"], ans:1, exp:"La prosopagnosie (incapacité à reconnaître les visages) est due à une lésion de l'hémisphère droit." },
  { id:110, c:1, type:"vf",  q:"La mémoire à court terme (MCT) a une capacité de stockage illimitée.", ans:false, exp:"Faux. La MCT a une capacité LIMITÉE à quelques éléments. C'est la MLT qui a une capacité illimitée." },
  { id:111, c:1, type:"vf",  q:"Plus le traitement est profond, plus la trace mnésique est durable.", ans:true,  exp:"Vrai. Kosslyn (1994) et Pylyshyn (1981) : l'efficacité de la mémoire est fonction du codage superficiel ou profond." },
  { id:112, c:1, type:"vf",  q:"Le stress améliore toujours la mémoire.", ans:false, exp:"Faux. Le stress libère des glucocorticoïdes qui perturbent l'encodage dans l'hippocampe." },
  { id:113, c:1, type:"vf",  q:"L'acétylcholine est un neurotransmetteur important pour la mémoire.", ans:true,  exp:"Vrai. L'acétylcholine joue un rôle crucial dans la mémoire. Sa pénurie explique les troubles d'Alzheimer." },
  { id:114, c:1, type:"vf",  q:"La mémoire implicite nécessite un effort conscient de récupération.", ans:false, exp:"Faux. La mémoire implicite s'utilise SANS effort conscient. C'est la mémoire explicite qui nécessite une récupération consciente." },
  { id:115, c:1, type:"def", q:"Définissez la MÉMOIRE selon le cours.", answer:"La mémoire est la capacité d'un système naturel ou artificiel à encoder l'information extraite de son expérience, à la stocker dans un format approprié, puis à la récupérer pour l'utiliser dans ses actions. Elle correspond à l'actualisation dans le comportement présent d'une information antérieure.", keywords:["encoder","stocker","récupérer","expérience","système"], exp:"3 étapes : encodage → rétention/stockage → récupération." },
  { id:116, c:1, type:"def", q:"Expliquez la différence entre MÉMOIRE DÉCLARATIVE et MÉMOIRE PROCÉDURALE.", answer:"La mémoire déclarative concerne les souvenirs de faits et d'événements (savoir QUE). La mémoire procédurale concerne les savoir-faire, gestes et automatismes (savoir COMMENT faire : nager, dribbler). Elle permet d'acquérir, retenir et employer des capacités perceptuelles, cognitives et motrices.", keywords:["déclarative","faits","événements","procédurale","savoir-faire","automatismes"], exp:"Ex : se souvenir de son anniversaire = déclarative. Savoir nager = procédurale." },
  // ── CHAP 2 ──
  { id:200, c:2, type:"qcm", q:"Selon William Stern (1912), comment se calcule le QI ?", opts:["QI = Âge Réel / Âge Mental × 100","QI = Âge Mental / Âge Réel × 100","QI = (AM + AR) / 2","QI = AM × AR / 100"], ans:1, exp:"William Stern (1912) : QI = Âge Mental / Âge Réel × 100. La moyenne est fixée à 100." },
  { id:201, c:2, type:"qcm", q:"Le test Binet-Simon couvre les enfants de quel âge ?", opts:["0 à 6 ans","3 à 13 ans","6 à 18 ans","Tous les âges"], ans:1, exp:"Le test Binet-Simon est une échelle de développement pour les enfants de 3 à 13 ans. Il évalue l'âge mental." },
  { id:202, c:2, type:"qcm", q:"Quels sont les 3 facteurs de développement de l'intelligence selon Piaget ?", opts:["Hérédité, environnement, hasard","Maturation neurologique, exercice/expérience, interactions sociales","QI, EQ, CI","Génétique, alimentation, éducation"], ans:1, exp:"3 facteurs : maturation neurologique, exercice et expérience, interactions et transmissions sociales." },
  { id:203, c:2, type:"qcm", q:"À quel stade de Piaget l'enfant développe-t-il la pensée symbolique et le jeu ?", opts:["Sensori-moteur","Pré-opératoire","Opérations concrètes","Opérations formelles"], ans:1, exp:"Stade pré-opératoire (2-7 ans) : fonction symbolique (langage, jeu, dessin). Mais égocentrisme cognitif." },
  { id:204, c:2, type:"qcm", q:"Qu'est-ce que l'égocentrisme cognitif de Piaget ?", opts:["Un défaut de caractère","L'incapacité à prendre le point de vue d'autrui","Un retard mental","Une forme d'autisme"], ans:1, exp:"L'égocentrisme de Piaget est COGNITIF, pas moral. L'enfant ne peut pas encore prendre le point de vue de l'autre." },
  { id:205, c:2, type:"qcm", q:"À quel stade l'enfant accède-t-il à la notion de réversibilité ?", opts:["Sensori-moteur","Pré-opératoire","Opérations concrètes","Opérations formelles"], ans:2, exp:"Stade opératoire concret (7-12 ans) : réversibilité, conservation des mesures, classifications." },
  { id:206, c:2, type:"qcm", q:"Qu'est-ce que la 'réification de l'intelligence' ?", opts:["L'idée que l'intelligence peut être développée","L'idée fausse que l'intelligence est fixe, innée","La mesure de l'intelligence par des tests","La transmission de l'intelligence de parent à enfant"], ans:1, exp:"Réification = croire que l'intelligence est une chose fixe, innée. Associée à l'héréditarisme (Goddard). Binet s'y opposait." },
  { id:207, c:2, type:"qcm", q:"Selon Terman, l'intelligence est :", opts:["La capacité à fournir de bonnes réponses","L'aptitude à maîtriser une pensée abstraite","La capacité d'apprendre dans son environnement","La capacité à s'adapter à des situations nouvelles"], ans:1, exp:"Terman : l'intelligence = aptitude à maîtriser une pensée abstraite." },
  { id:208, c:2, type:"qcm", q:"Le stade des 'Opérations Formelles' commence vers :", opts:["5 ans","7 ans","11-12 ans","18 ans"], ans:2, exp:"Opérations Formelles (11-12 ans+) : pensée abstraite, raisonnement hypothético-déductif." },
  { id:209, c:2, type:"qcm", q:"L'accommodation selon Piaget correspond à :", opts:["Intégrer le nouveau dans les schèmes existants","Modifier les schèmes en fonction des données nouvelles du milieu","L'équilibre entre assimilation et accommodation","Refuser toute nouvelle information"], ans:1, exp:"Accommodation = transformer les schèmes existants pour intégrer les nouvelles informations." },
  { id:210, c:2, type:"vf",  q:"Le QI mesure la totalité de l'intelligence d'un individu.", ans:false, exp:"Faux. Le QI ne mesure qu'une partie (analytique/logique). Il ne mesure pas les intelligences motrices, musicales, sociales, émotionnelles." },
  { id:211, c:2, type:"vf",  q:"Selon Piaget, le stade sensori-moteur dure de 0 à 18-24 mois.", ans:true,  exp:"Vrai. Stade sensori-moteur (0-18/24 mois) : réflexes, réactions circulaires, schémas d'action qui se complexifient." },
  { id:212, c:2, type:"vf",  q:"Pour Piaget, tous les enfants passent par les mêmes stades dans le même ordre.", ans:true,  exp:"Vrai. Les stades sont universels et invariants (même ordre pour tous). Le rythme et la durée varient." },
  { id:213, c:2, type:"vf",  q:"Goddard visait à intégrer les personnes moins intelligentes dans la société.", ans:false, exp:"Faux. Goddard visait à les ÉCARTER. Position réfutée aujourd'hui." },
  { id:214, c:2, type:"def", q:"Définissez l'ASSIMILATION et l'ACCOMMODATION selon Piaget.", answer:"L'assimilation est l'intégration des données de l'expérience dans la structure existante de l'individu. L'accommodation est la modification de la structure de l'individu en fonction des données nouvelles du milieu. L'adaptation est l'équilibre entre les deux.", keywords:["assimilation","intégration","accommodation","modification","adaptation","équilibre"], exp:"Piaget : l'intelligence se construit par l'interaction de ces deux mécanismes." },
  { id:215, c:2, type:"def", q:"Décrivez les 4 stades de Piaget avec leurs âges.", answer:"1. Sensori-Moteur (0-18/24 mois) : réflexes, réactions circulaires. 2. Pré-Opératoire (2-7 ans) : pensée symbolique, égocentrisme cognitif. 3. Opérations Concrètes (7-12 ans) : réversibilité, conservation. 4. Opérations Formelles (11-12 ans+) : raisonnement hypothético-déductif, pensée abstraite.", keywords:["sensori-moteur","pré-opératoire","opérations concrètes","opérations formelles","réversibilité"], exp:"Les stades sont universels et invariants. Chaque stade intègre et dépasse le précédent." },
  // ── CHAP 3 ──
  { id:300, c:3, type:"qcm", q:"Selon Goldenson (1970), la motivation est :", opts:["L'ensemble des besoins biologiques","La dynamique du comportement et de son maintien","La récompense obtenue après un effort","La pression sociale exercée sur l'individu"], ans:1, exp:"Goldenson (1970) : la motivation est la dynamique du comportement et de son maintien." },
  { id:301, c:3, type:"qcm", q:"Quelles sont les 3 grandes catégories de motivation ?", opts:["Intrinsèque, extrinsèque, mixte","Biologique, psychologique, sociale","Fondamentales, besoins de stimulation, acquises secondaires","Primaires, secondaires, tertiaires"], ans:2, exp:"3 catégories : fondamentales (besoins biologiques), besoins de stimulation (curiosité), acquises secondaires (puissance, prestige)." },
  { id:302, c:3, type:"qcm", q:"Qui a introduit le concept d'homéostasie en 1926 ?", opts:["Maslow","Freud","Cannon","Butler"], ans:2, exp:"Cannon (1926) : homéostasie = état d'équilibre du milieu interne." },
  { id:303, c:3, type:"qcm", q:"Dans la pyramide de Maslow, quel besoin est au sommet ?", opts:["Sécurité","Appartenance","Estime personnelle","Réalisation de soi"], ans:3, exp:"Sommet = réalisation de soi (niveau 5). Maslow : niveaux 4 et 5 rarement atteints." },
  { id:304, c:3, type:"qcm", q:"Qu'est-ce que l'hospitalisme selon Spitz ?", opts:["Une maladie infectieuse","Un état d'altération physique chez les nourrissons privés d'affection","Un trouble de la mémoire","Un syndrome d'anxiété de séparation"], ans:1, exp:"Spitz : l'hospitalisme = altération physique profonde chez de très jeunes enfants placés en institution avec carence affective." },
  { id:305, c:3, type:"qcm", q:"Selon Mac Clelland (1961), les personnes à fort besoin de réussite :", opts:["Choisissent des objectifs impossibles","Choisissent des défis intermédiaires","Évitent toute situation d'évaluation","Attribuent leur échec à la malchance"], ans:1, exp:"Mac Clelland (1961) : fort besoin de réussite → défis intermédiaires (ni trop faciles, ni impossibles)." },
  { id:306, c:3, type:"qcm", q:"Qu'a montré Harlon sur la motivation intrinsèque ?", opts:["Les récompenses augmentent toujours la motivation","Les singes récompensés jouaient MOINS par la suite","Les récompenses n'ont aucun effet","La motivation intrinsèque se développe avec la pratique"], ans:1, exp:"Harlon : les singes récompensés jouaient moins par la suite. → 'Le renforcement tue la motivation intrinsèque.'" },
  { id:307, c:3, type:"qcm", q:"L'attachement selon Bowlby est :", opts:["Un besoin secondaire acquis","Une tendance primaire et permanente à rechercher le contact avec un congénère","Un réflexe conditionné","Un besoin uniquement humain"], ans:1, exp:"Bowlby : attachement = tendance à rechercher le contact avec un congénère. C'est un besoin primaire et permanent." },
  { id:308, c:3, type:"vf",  q:"Selon Maslow, les besoins physiologiques doivent être satisfaits avant d'accéder aux besoins supérieurs.", ans:true,  exp:"Vrai. Maslow : besoins physiologiques et de sécurité DOIVENT être satisfaits pour accéder aux besoins supérieurs." },
  { id:309, c:3, type:"vf",  q:"La motivation extrinsèque (récompenses) augmente toujours la motivation intrinsèque.", ans:false, exp:"Faux. C'est l'inverse. Harlon et Deci ont montré que les récompenses externes DIMINUENT la motivation intrinsèque." },
  { id:310, c:3, type:"vf",  q:"Selon Bowlby, le besoin d'attachement est aussi important que les besoins physiologiques.", ans:true,  exp:"Vrai. Bowlby : le besoin de contact et de stimulation est aussi important pour la survie du nourrisson que les besoins physiologiques." },
  { id:311, c:3, type:"vf",  q:"Pour Deci, les récompenses monétaires diminuent la motivation intrinsèque.", ans:true,  exp:"Vrai. Deci : la motivation intrinsèque est diminuée par tout ce qui est perçu comme un contrôle." },
  { id:312, c:3, type:"def", q:"Définissez la MOTIVATION selon le cours.", answer:"La motivation est l'ensemble des mécanismes biologiques et physiologiques qui permettent le déclenchement de l'action, son orientation, son intensité et sa persistance. Pour Goldenson (1970), c'est la dynamique du comportement et de son maintien.", keywords:["déclenchement","orientation","intensité","persistance","comportement","Goldenson"], exp:"3 types : fondamentales, stimulation, acquises secondaires." },
  { id:313, c:3, type:"def", q:"Expliquez la pyramide des besoins de MASLOW.", answer:"Maslow organise les besoins humains en pyramide hiérarchique. Base : besoins physiologiques (air, eau, sommeil). Niveau 2 : sécurité. Niveau 3 : besoins sociaux/appartenance. Niveau 4 : estime personnelle. Sommet : réalisation de soi. Les besoins inférieurs doivent être satisfaits avant d'accéder aux supérieurs.", keywords:["pyramide","hiérarchique","physiologiques","sécurité","sociaux","estime","réalisation"], exp:"Maslow : les besoins d'estime et de réalisation de soi sont rarement atteints." },
  // ── CHAP 4 ──
  { id:400, c:4, type:"qcm", q:"La perception est définie dans le cours comme :", opts:["La réception brute des stimuli par les organes des sens","L'ensemble des mécanismes par lesquels l'organisme prend connaissance du monde","La mémorisation des expériences sensorielles","La réaction motrice à un stimulus"], ans:1, exp:"Perception = ensemble des mécanismes par lesquels l'organisme prend connaissance du monde. C'est le traitement de l'information." },
  { id:401, c:4, type:"qcm", q:"L'approche Bottom-up (directe) en perception signifie que :", opts:["Les connaissances s'imposent à l'environnement","L'environnement s'impose aux connaissances","La perception dépend entièrement de la mémoire","La perception est un processus purement biologique"], ans:1, exp:"Bottom-up (approche directe, Gibson, Gestalt) : l'environnement s'impose aux connaissances." },
  { id:402, c:4, type:"qcm", q:"La PROPRIOCEPTION est :", opts:["La vision en 3D","Le sens de l'équilibre","Le sens qui renseigne sur la position du corps dans l'espace","La capacité à percevoir les sons très graves"], ans:2, exp:"Proprioception = 6e sens qui renseigne sur la position et les mouvements du corps dans l'espace. Fondamentale en EPS." },
  { id:403, c:4, type:"qcm", q:"Combien d'étapes comporte le traitement de l'information dans la perception ?", opts:["2","3","4","5"], ans:2, exp:"4 étapes : Monde physique → Énergie/Stimulus → Récepteur sensoriel/Influx nerveux → SNC/Percept." },
  { id:404, c:4, type:"qcm", q:"Quelle est la différence entre SENSATION et PERCEPTION ?", opts:["Ce sont des synonymes","Sensation = physiologique (détection), Perception = psychologique (interprétation)","Sensation = psychologique, Perception = physiologique","Sensation est plus précise que la perception"], ans:1, exp:"Sensation = processus physiologique de détection des stimuli. Perception = interprétation psychologique." },
  { id:405, c:4, type:"qcm", q:"L'image rétinienne brute est caractérisée par :", opts:["Elle est tridimensionnelle, droite, complète","Elle est inversée, bidimensionnelle, zone de netteté réduite à 2°","Elle est identique à ce que perçoit le cerveau","Elle est parfaitement fidèle à la réalité"], ans:1, exp:"L'image rétinienne est inversée, bidimensionnelle, et la zone de netteté parfaite est réduite à 2 degrés d'angles." },
  { id:406, c:4, type:"qcm", q:"L'approche Top-down (indirecte) est associée à :", opts:["Gibson","Gestalt","Bruner","Wundt"], ans:2, exp:"Top-down (approche indirecte, Bruner) : les connaissances s'imposent à l'environnement." },
  { id:407, c:4, type:"qcm", q:"Combien de sens avons-nous (en incluant la proprioception) ?", opts:["4","5","6","7"], ans:2, exp:"6 sens : goût, odorat, audition, toucher, vue + proprioception (6e sens)." },
  { id:408, c:4, type:"vf",  q:"La perception est une copie exacte et fidèle de la réalité.", ans:false, exp:"Faux. La perception est une CONSTRUCTION active du cerveau. Elle peut être influencée par l'attention, l'expérience, les émotions." },
  { id:409, c:4, type:"vf",  q:"Notre système perceptif peut percevoir tous les types de stimuli existants.", ans:false, exp:"Faux. Le système perceptif est limité : on ne perçoit pas les ultrasons, certaines odeurs, les infrarouges." },
  { id:410, c:4, type:"vf",  q:"L'approche Top-down signifie que nos connaissances influencent notre perception.", ans:true,  exp:"Vrai. Top-down (Bruner) : les connaissances s'imposent à l'environnement. La mémoire influence directement la perception." },
  { id:411, c:4, type:"vf",  q:"La proprioception est l'un des 5 sens traditionnels.", ans:false, exp:"Faux. Les 5 sens traditionnels sont : goût, odorat, audition, toucher, vue. La proprioception est un 6e sens." },
  { id:412, c:4, type:"def", q:"Définissez la PERCEPTION selon le cours.", answer:"La perception se définit comme l'ensemble des mécanismes par lesquels l'organisme prend connaissance du monde, sur la base des informations du sujet. Le système perceptif transforme des stimulations en informations. C'est le traitement de l'information et la représentation du monde physique.", keywords:["mécanismes","prise d'informations","stimulations","traitement","représentation"], exp:"Sensation = physiologique. Perception = psychologique." },
  { id:413, c:4, type:"def", q:"Expliquez les approches BOTTOM-UP et TOP-DOWN de la perception.", answer:"Bottom-up (approche directe, Gibson, Gestalt) : l'environnement s'impose aux connaissances. La perception de premier accès est déterminée par les caractéristiques physiques du stimulus. Top-down (approche indirecte, Bruner) : les connaissances préalables s'imposent à l'environnement. L'expérience, la mémoire et les attentes influencent la perception.", keywords:["bottom-up","direct","environnement","top-down","indirect","connaissances","Gibson","Bruner"], exp:"Exemple : la première fois = bottom-up. Si on le connaît déjà = top-down." },
  // ── CHAP 5 ──
  { id:500, c:5, type:"qcm", q:"Selon Reuchlin (1977), il y a apprentissage quand :", opts:["L'individu mémorise une information","Un individu placé plusieurs fois dans la même situation modifie sa conduite de façon systématique et durable","Le sujet reproduit exactement un comportement observé","L'individu reçoit une récompense"], ans:1, exp:"Reuchlin (1977) : apprentissage = modification systématique et DURABLE de la conduite dans une même situation." },
  { id:501, c:5, type:"qcm", q:"Combien de théories d'apprentissage sont abordées dans le cours ?", opts:["2","3","4","5"], ans:2, exp:"4 théories : comportementale (béhaviorisme), constructiviste (Piaget), socio-constructiviste (Vygotsky), socio-cognitive (Bandura)." },
  { id:502, c:5, type:"qcm", q:"Watson crée le béhaviorisme en quelle année ?", opts:["1879","1900","1913","1945"], ans:2, exp:"Watson crée le béhaviorisme en 1913 à partir du mot 'behaviour' (comportement)." },
  { id:503, c:5, type:"qcm", q:"Pavlov a découvert le conditionnement classique en étudiant :", opts:["Des rats dans un labyrinthe","La digestion des chiens","Des singes en cage","Des enfants en bas âge"], ans:1, exp:"Pavlov utilisait des chiens dans son laboratoire pour des études sur la digestion. Prix Nobel." },
  { id:504, c:5, type:"qcm", q:"Dans le conditionnement classique, qu'est-ce que le Stimulus Conditionnel (SC) ?", opts:["La nourriture (provoque la salivation naturellement)","Le son de cloche avant le conditionnement (neutre)","Le son de cloche APRÈS le conditionnement, qui provoque seul la salivation","La salivation provoquée par le son seul"], ans:2, exp:"SC = stimulus initialement neutre qui, après association répétée avec le SI, provoque seul la réaction conditionnelle." },
  { id:505, c:5, type:"qcm", q:"Qu'est-ce que l'EXTINCTION dans le conditionnement ?", opts:["L'augmentation progressive de la réponse conditionnée","La disparition de la réponse conditionnelle suite à l'absence du SI","Le renforcement d'un comportement par récompense","La généralisation à d'autres stimuli similaires"], ans:1, exp:"Extinction = disparition de la RC suite à l'absence répétée du SI. Récupération Spontanée : après repos, le SC redevient efficace." },
  { id:506, c:5, type:"qcm", q:"Qui a développé la boîte de Skinner et le conditionnement opérant ?", opts:["Pavlov","Watson","Skinner (1904-1988)","Thorndike"], ans:2, exp:"BF Skinner (1904-1988) développe le conditionnement opérant. Boîte : rat affamé + levier → nourriture." },
  { id:507, c:5, type:"qcm", q:"La ZPD de Vygotsky est la distance entre :", opts:["Le niveau actuel (seul) et le niveau potentiel (avec aide)","Le niveau scolaire et le niveau réel","L'âge mental et l'âge chronologique","Ce que l'enfant sait et ce qu'il ne sait pas"], ans:0, exp:"ZPD = distance entre ce que l'enfant peut faire seul (développement actuel) et avec aide (niveau potentiel)." },
  { id:508, c:5, type:"qcm", q:"Qui est l'auteur de la théorie de l'apprentissage social (vicariant) ?", opts:["Piaget","Vygotsky","Bandura (1971)","Bruner"], ans:2, exp:"Albert Bandura (1971) : théorie de l'apprentissage social ou vicariant ou modelage. Apprendre par observation d'autrui." },
  { id:509, c:5, type:"qcm", q:"Combien de processus comporte l'apprentissage vicariant de Bandura ?", opts:["2","3","4","5"], ans:2, exp:"4 processus : 1) Attentionnel, 2) Rétention, 3) Reproduction motrice, 4) Motivationnel." },
  { id:510, c:5, type:"qcm", q:"Combien de lois partagent le conditionnement classique et le conditionnement opérant ?", opts:["3","5","7","10"], ans:2, exp:"7 lois communes : répétition, contiguïté temporelle, extinction, récupération spontanée, généralisation, discrimination, inhibition." },
  { id:511, c:5, type:"qcm", q:"Le renforcement NÉGATIF consiste à :", opts:["Punir un comportement indésirable","Retirer un stimulus désagréable pour augmenter la fréquence d'un comportement","Présenter un stimulus désagréable","Ignorer un comportement"], ans:1, exp:"Renforcement négatif = retirer un stimulus DÉSAGRÉABLE pour augmenter la fréquence du comportement." },
  { id:512, c:5, type:"vf",  q:"Selon Piaget, le rééquilibrage (après déséquilibre) constitue le véritable apprentissage.", ans:true,  exp:"Vrai. Piaget : déséquilibre → rééquilibrage (construction d'une nouvelle structure cognitive) = apprentissage réel." },
  { id:513, c:5, type:"vf",  q:"Pour Vygotsky, la vraie direction du développement va de l'individuel au social.", ans:false, exp:"Faux. Vygotsky : 'La vraie direction du développement ne va pas de l'individuel au social, mais du SOCIAL à l'INDIVIDUEL.'" },
  { id:514, c:5, type:"vf",  q:"Selon Bandura, l'être humain n'apprend que par essai-erreur direct.", ans:false, exp:"Faux. Bandura montre que l'être humain apprend aussi par OBSERVATION d'autrui (apprentissage vicariant/modelage)." },
  { id:515, c:5, type:"vf",  q:"Dans le conditionnement classique, l'optimum de contiguïté temporelle est une demi-seconde d'avance du SC.", ans:true,  exp:"Vrai. La loi de contiguïté temporelle : optimum = une demi-seconde d'avance du SC sur le SI." },
  { id:516, c:5, type:"vf",  q:"Vygotsky pense que c'est la croissance cognitive qui précède et permet l'apprentissage.", ans:false, exp:"Faux. C'est la position de PIAGET. Pour Vygotsky, c'est l'APPRENTISSAGE qui tire le développement." },
  { id:517, c:5, type:"def", q:"Définissez l'APPRENTISSAGE selon le cours.", answer:"L'apprentissage désigne la modification systématique des connaissances, du comportement et des capacités en fonction de l'entraînement. Selon Reuchlin (1977) : modification systématique et durable de la conduite dans une même situation.", keywords:["modification systématique","comportement","connaissances","capacités","durable"], exp:"Doré & Mercier (1992) : acquérir des connaissances sur le monde et les modifier." },
  { id:518, c:5, type:"def", q:"Définissez la ZPD de Vygotsky et son importance pédagogique.", answer:"La Zone Proximale de Développement (ZPD) est la distance entre deux niveaux : le niveau de développement actuel (ce que l'enfant peut faire seul) et le niveau de développement potentiel (ce qu'il peut faire avec l'aide d'un adulte ou d'un pair). C'est dans la ZPD que l'enseignant doit intervenir.", keywords:["distance","développement actuel","seul","potentiel","aide","adulte","ZPD"], exp:"Vygotsky : 'Ce que l'enfant sait faire aujourd'hui en collaboration, il saura le faire tout seul demain.'" },
  { id:519, c:5, type:"def", q:"Expliquez l'ÉTAYAGE de Bruner et ses 6 fonctions du tuteur.", answer:"L'étayage (Bruner, 1983) est le soutien apporté par le tuteur à l'apprenant pour lui permettre de résoudre un problème au-delà de ses capacités actuelles. 6 fonctions : Enrôler (susciter l'intérêt), Réduire le degré de liberté, Maintenir l'orientation, Signaler les caractéristiques déterminantes, Contrôler la frustration, Démontrer.", keywords:["étayage","Bruner","tuteur","enrôler","réduire","maintenir","signaler","contrôler","démontrer"], exp:"2 aspects : socio-affectif (enrôlement) et cognitif (alléger la tâche)." },
  // ── CHAP 6 ──
  { id:600, c:6, type:"qcm", q:"Qui a créé le premier laboratoire de psychologie de l'enfant en 1883 ?", opts:["Wundt","Piaget","Hall","Darwin"], ans:2, exp:"Hall a créé le premier laboratoire de psychologie de l'enfant en 1883. Il a créé la 'paidologie'." },
  { id:601, c:6, type:"qcm", q:"La théorie de la Sélection Naturelle de Darwin stipule que :", opts:["Tous les individus d'une espèce survivent","Seuls les individus capables de s'adapter survivent","L'évolution se fait par sauts brutaux","L'homme et l'animal sont totalement différents"], ans:1, exp:"Darwin : Sélection Naturelle = seuls les individus capables de s'adapter survivent." },
  { id:602, c:6, type:"qcm", q:"La CROISSANCE se distingue de la MATURATION car :", opts:["La croissance est inférée du comportement","La croissance = modifications physiques observables, la maturation = processus internes inférés","Elles sont synonymes","La croissance concerne le cerveau, la maturation le corps"], ans:1, exp:"Croissance = modifications physiques OBSERVABLES (taille, poids). Maturation = processus INTERNES inférés." },
  { id:603, c:6, type:"qcm", q:"L'Ontogenèse étudie :", opts:["Le développement d'une espèce","Le développement de l'individu de sa conception à sa mort","Le développement dans une situation particulière","L'évolution de l'espèce humaine"], ans:1, exp:"Ontogenèse = développement de l'individu de sa conception à sa mort. Phylogenèse = espèce. Microgenèse = situation particulière." },
  { id:604, c:6, type:"qcm", q:"Le développement Céphalo-Caudal signifie que :", opts:["Le développement va du proche vers l'éloigné du SNC","Le développement va de la tête aux pieds","Le développement est continu et régulier","Le développement va du simple au complexe"], ans:1, exp:"Céphalo-Caudal = de la tête aux pieds (tenir la tête → assis → debout → marche)." },
  { id:605, c:6, type:"qcm", q:"Quelle est la limite principale de l'approche longitudinale ?", opts:["Elle ne peut pas décrire le développement individuel","La mortalité expérimentale et l'effet d'entraînement","Elle confond les différences d'âge avec les effets de génération","Elle est trop rapide pour être fiable"], ans:1, exp:"Inconvénients longitudinale : coût en temps, mortalité expérimentale, effet d'entraînement." },
  { id:606, c:6, type:"qcm", q:"L'effet de cohorte est un problème lié à quelle méthode ?", opts:["Longitudinale","Transversale","Mixte/séquentielle","Expérimentale"], ans:1, exp:"Approche transversale : limite = effet de cohorte (personnes d'âges différents ont vécu des conditions différentes)." },
  { id:607, c:6, type:"qcm", q:"Selon les maturationnistes, quel facteur est seul responsable du développement ?", opts:["L'environnement social","Le patrimoine génétique","L'éducation","L'alimentation"], ans:1, exp:"Maturationnistes : le patrimoine génétique est seul responsable du développement. Notion de 'période critique'." },
  { id:608, c:6, type:"qcm", q:"Selon les empiristes, l'esprit de l'enfant à la naissance est :", opts:["Déjà structuré génétiquement","Une table rase (rien n'est prédéterminé)","En partie inné, en partie acquis","Dominé par les instincts"], ans:1, exp:"Empiristes : esprit = table rase à la naissance. Tout est appris par facteurs sociaux/externes." },
  { id:609, c:6, type:"qcm", q:"L'empreinte de Lorentz : le bébé oiseau suit le premier objet mobile perçu pendant :", opts:["Les premiers 7 jours","Les premières 24 heures après l'éclosion","Les premières 3 semaines","Le premier mois"], ans:1, exp:"Lorentz : le bébé oiseau suit le premier objet mobile perçu dans les 24h après l'éclosion." },
  { id:610, c:6, type:"qcm", q:"L'approche transversale consiste à :", opts:["Suivre les mêmes individus dans le temps","Étudier au même moment plusieurs groupes d'âges différents","Combiner les deux approches","Observer des individus dans leur milieu naturel"], ans:1, exp:"Transversale : au même moment, plusieurs groupes d'âges différents. Plus rapide mais effet de cohorte." },
  { id:611, c:6, type:"vf",  q:"Le développement physique suit un ordre Céphalo-Caudal (de la tête aux pieds).", ans:true,  exp:"Vrai. 2 axes : Céphalo-Caudal (tête→pieds) et Proximo-Distal (proche→éloigné du SNC)." },
  { id:612, c:6, type:"vf",  q:"Le débat inné/acquis est aujourd'hui considéré comme dépassé.", ans:true,  exp:"Vrai. Le développement est aujourd'hui considéré comme résultant de l'INTERACTION entre facteurs biologiques ET sociaux." },
  { id:613, c:6, type:"vf",  q:"Durant le vieillissement, il n'y a que des pertes, pas de gains.", ans:false, exp:"Faux. Le développement est multidirectionnel. Durant le vieillissement : pertes (neurones) MAIS AUSSI gains (sagesse, nouveaux mots)." },
  { id:614, c:6, type:"vf",  q:"L'observation non participante est plus fidèle car elle n'influence pas le comportement observé.", ans:true,  exp:"Vrai. Non participante (observateur non vu) : ne perturbe pas le comportement, plus fidèle à la réalité." },
  { id:615, c:6, type:"vf",  q:"Selon les maturationnistes, l'environnement social joue un rôle fondamental dans le développement.", ans:false, exp:"Faux. Les maturationnistes estiment que le patrimoine génétique est LE SEUL facteur responsable." },
  { id:616, c:6, type:"def", q:"Définissez la PSYCHOLOGIE DU DÉVELOPPEMENT.", answer:"La psychologie du développement étudie les changements développementaux et les différents facteurs qui interviennent sur ces changements et leurs interactions, de la conception à la mort de l'individu. Elle étudie la croissance (modifications physiques observables) et la maturation (processus internes inférés, cognitif, affectif et neuronal).", keywords:["changements développementaux","conception","mort","croissance","maturation"], exp:"3 niveaux : Ontogenèse (individu), Phylogenèse (espèce), Microgenèse (situation particulière)." },
  { id:617, c:6, type:"def", q:"Distinguez l'approche LONGITUDINALE et l'approche TRANSVERSALE.", answer:"Longitudinale : suivre les mêmes individus dans le temps. Précise, décrit exactement le développement individuel, mais coûteuse et mortalité expérimentale. Transversale : étudier au même moment plusieurs groupes d'âges différents. Rapide, économique, mais soumise à l'effet de cohorte. Les deux approches sont complémentaires.", keywords:["longitudinale","mêmes individus","transversale","groupes d'âges","cohorte","complémentaires"], exp:"Approche mixte = combine les deux." },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TYPE_COLORS = {
  qcm: { badge: "bg-violet-500/20 text-violet-300 border border-violet-500/30", label: "QCM" },
  vf:  { badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", label: "VRAI / FAUX" },
  def: { badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30", label: "DÉFINITION" },
};

// ─────────────────────────────────────────────
// SCORE RING
// ─────────────────────────────────────────────
function ScoreRing({ pct, correct, total }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (circ * pct) / 100;
  const color = pct >= 75 ? "#10d98c" : pct >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1b4b" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color }}>{pct}%</span>
        <span className="text-xs text-slate-400">{correct}/{total}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WELCOME SCREEN
// ─────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  const [selected, setSelected] = useState(new Set([0,1,2,3,4,5,6]));

  const toggle = (id) => setSelected(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const totalQ = ALL_QUESTIONS.filter(q => selected.has(q.c)).length;
  const qcmCount = ALL_QUESTIONS.filter(q => q.type === "qcm").length;
  const vfCount  = ALL_QUESTIONS.filter(q => q.type === "vf").length;
  const defCount = ALL_QUESTIONS.filter(q => q.type === "def").length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "radial-gradient(ellipse 90% 60% at 20% 5%, rgba(109,40,217,0.15) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 90%, rgba(16,185,129,0.08) 0%, transparent 60%), #020817" }}>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
        <span className="text-violet-400 text-xs font-bold tracking-widest uppercase">PC1 STAPS — INJS</span>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-black text-white text-center leading-none mb-3"
        style={{ fontFamily: "'Syne', sans-serif" }}>
        Quiz<br />
        <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
          Psychologie
        </span>
      </h1>
      <p className="text-slate-400 text-base mb-8 text-center">Choisissez vos chapitres · 5 vies · Note sur 20</p>

      {/* Stats pills */}
      <div className="flex gap-3 flex-wrap justify-center mb-8">
        {[
          { label: "QCM", count: qcmCount, color: "text-violet-400", dot: "bg-violet-400" },
          { label: "Vrai/Faux", count: vfCount, color: "text-emerald-400", dot: "bg-emerald-400" },
          { label: "Définitions", count: defCount, color: "text-amber-400", dot: "bg-amber-400" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className="text-slate-300">{s.label}</span>
            <span className={`font-bold ${s.color}`}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Select row */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setSelected(new Set([0,1,2,3,4,5,6]))}
          className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
          Tout sélectionner
        </button>
        <button onClick={() => setSelected(new Set())}
          className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
          Tout désélectionner
        </button>
      </div>

      {/* Chapter grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-6">
        {CHAPTERS.map(ch => {
          const isActive = selected.has(ch.id);
          const count = ALL_QUESTIONS.filter(q => q.c === ch.id).length;
          return (
            <button key={ch.id} onClick={() => toggle(ch.id)}
              className={`relative rounded-2xl p-4 text-left transition-all duration-200 border ${
                isActive
                  ? "bg-violet-600/15 border-violet-500/60 shadow-lg shadow-violet-900/20"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-600"
              }`}>
              <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isActive ? "bg-violet-500 text-white" : "border border-slate-700 text-transparent"
              }`}>✓</div>
              <div className="text-2xl mb-1">{ch.icon}</div>
              <div className={`text-sm font-semibold leading-tight ${isActive ? "text-white" : "text-slate-400"}`}>{ch.label}</div>
              <div className="text-xs text-slate-500 mt-1">{count} questions</div>
            </button>
          );
        })}
      </div>

      <p className="text-slate-500 text-sm mb-5">{totalQ} question{totalQ > 1 ? "s" : ""} sélectionnée{totalQ > 1 ? "s" : ""}</p>

      <button
        disabled={totalQ === 0}
        onClick={() => onStart(selected)}
        className="px-10 py-4 rounded-2xl text-white font-bold text-lg tracking-wide
          bg-gradient-to-br from-violet-600 to-violet-800
          hover:from-violet-500 hover:to-violet-700
          disabled:opacity-40 disabled:pointer-events-none
          transition-all duration-200 hover:-translate-y-0.5
          shadow-lg shadow-violet-900/40"
        style={{ fontFamily: "'Syne', sans-serif" }}>
        Commencer →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUIZ SCREEN
// ─────────────────────────────────────────────
function QuizScreen({ questions, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [lives, setLives] = useState(5);
  const [scoreRaw, setScoreRaw] = useState(0); // correct - 0.5*wrong
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null); // {type:'ok'|'bad'|'skip', msg, exp}
  const [chosen, setChosen] = useState(null);
  const [defText, setDefText] = useState("");

  const q = questions[idx];
  const chap = CHAPTERS.find(c => c.id === q?.c);
  const pct = Math.round((idx / questions.length) * 100);

  const advance = useCallback((newLives) => {
    const nextIdx = idx + 1;
    if (newLives <= 0) {
      setTimeout(() => onFinish({ lives: 0, correctCount, wrongCount, skippedCount, scoreRaw, total: questions.length }), 900);
      return;
    }
    if (nextIdx >= questions.length) {
      onFinish({ lives: newLives, correctCount, wrongCount, skippedCount, scoreRaw, total: questions.length });
      return;
    }
    setTimeout(() => {
      setIdx(nextIdx);
      setAnswered(false);
      setFeedback(null);
      setChosen(null);
      setDefText("");
    }, 1400);
  }, [idx, questions.length, correctCount, wrongCount, skippedCount, scoreRaw, onFinish]);

  const handleCorrect = useCallback(() => {
    setCorrectCount(p => p + 1);
    setScoreRaw(p => p + 1);
    setFeedback({ type: "ok", msg: "✅ Bonne réponse ! +1 point", exp: q.exp });
    advance(lives);
  }, [q, lives, advance]);

  const handleWrong = useCallback(() => {
    const newLives = lives - 1;
    setWrongCount(p => p + 1);
    setScoreRaw(p => p - 0.5);
    setLives(newLives);
    setFeedback({ type: "bad", msg: `❌ Mauvaise réponse — −0,5 pt · ❤️ ${newLives}/5`, exp: q.exp });
    advance(newLives);
  }, [q, lives, advance]);

  const handleSkip = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    setSkippedCount(p => p + 1);
    setFeedback({ type: "skip", msg: "⏭ Question passée — 0 point", exp: q.exp });
    advance(lives);
  }, [answered, q, lives, advance]);

  const answerQCM = (i) => {
    if (answered) return;
    setAnswered(true);
    setChosen(i);
    if (i === q.ans) handleCorrect();
    else handleWrong();
  };

  const answerVF = (val) => {
    if (answered) return;
    setAnswered(true);
    setChosen(val);
    if (val === q.ans) handleCorrect();
    else handleWrong();
  };

  const answerDef = () => {
    if (answered || !defText.trim()) return;
    setAnswered(true);
    const userLower = defText.toLowerCase();
    const found = q.keywords.filter(k => userLower.includes(k.toLowerCase()));
    const ratio = found.length / q.keywords.length;
    if (ratio >= 0.4) handleCorrect();
    else handleWrong();
  };

  if (!q) return null;
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-6"
      style={{ background: "radial-gradient(ellipse 90% 60% at 20% 5%, rgba(109,40,217,0.12) 0%, transparent 60%), #020817" }}>

      <div className="w-full max-w-xl">
        {/* HUD */}
        <div className="flex items-center gap-3 mb-6">
          {/* Hearts */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xl transition-all duration-300 ${i < lives ? "opacity-100 scale-100" : "opacity-20 scale-75"}`}>❤️</span>
            ))}
          </div>
          {/* Bar */}
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          {/* Counter */}
          <span className="text-slate-500 text-sm whitespace-nowrap">{idx + 1}/{questions.length}</span>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          {/* Meta */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${TYPE_COLORS[q.type].badge}`}>
              {TYPE_COLORS[q.type].label}
            </span>
            <span className="text-slate-500 text-xs font-medium">{chap.icon} {chap.label}</span>
          </div>

          {/* Question */}
          <p className="text-white font-bold text-lg leading-snug mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>
            {q.q}
          </p>

          {/* QCM */}
          {q.type === "qcm" && (
            <div className="flex flex-col gap-2.5">
              {q.opts.map((opt, i) => {
                let cls = "bg-slate-800 border-slate-700 text-slate-300 hover:border-violet-500/50 hover:bg-slate-700/60";
                if (answered) {
                  if (i === q.ans) cls = "bg-emerald-500/15 border-emerald-500 text-emerald-300";
                  else if (i === chosen && i !== q.ans) cls = "bg-red-500/15 border-red-500 text-red-300";
                  else cls = "bg-slate-800 border-slate-700 text-slate-500 opacity-50";
                }
                return (
                  <button key={i} disabled={answered} onClick={() => answerQCM(i)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${cls}`}>
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 border ${
                      answered && i === q.ans ? "bg-emerald-500 border-emerald-500 text-white" :
                      answered && i === chosen && i !== q.ans ? "bg-red-500 border-red-500 text-white" :
                      "bg-slate-700 border-slate-600 text-slate-400"
                    }`}>{letters[i]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* VF */}
          {q.type === "vf" && (
            <div className="flex gap-3 mt-1">
              {[true, false].map((val) => {
                let cls = "border-slate-700 bg-slate-800 text-slate-300 hover:border-violet-500/50";
                if (answered) {
                  if (val === q.ans) cls = "border-emerald-500 bg-emerald-500/15 text-emerald-300";
                  else if (val === chosen) cls = "border-red-500 bg-red-500/15 text-red-300";
                  else cls = "border-slate-700 bg-slate-800 text-slate-500 opacity-40";
                }
                return (
                  <button key={String(val)} disabled={answered} onClick={() => answerVF(val)}
                    className={`flex-1 py-4 rounded-2xl border font-black text-base transition-all duration-200 hover:-translate-y-0.5 ${cls}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    {val ? "✅ VRAI" : "❌ FAUX"}
                  </button>
                );
              })}
            </div>
          )}

          {/* DEF */}
          {q.type === "def" && (
            <div>
              <textarea
                value={defText}
                onChange={e => setDefText(e.target.value)}
                disabled={answered}
                placeholder="Rédigez votre définition ici…"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none outline-none focus:border-violet-500/60 transition-colors min-h-24"
              />
              {!answered && (
                <div className="flex gap-2 mt-3">
                  <button onClick={answerDef} disabled={!defText.trim()}
                    className="px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:pointer-events-none">
                    ✅ Valider
                  </button>
                  <button onClick={handleSkip}
                    className="px-5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-sm font-semibold hover:text-white hover:border-slate-500 transition-colors">
                    ⏭ Passer
                  </button>
                </div>
              )}
              {answered && feedback && q.type === "def" && (
                <div className="mt-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 mb-1">📖 Réponse modèle :</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{q.answer}</p>
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`mt-4 p-3.5 rounded-2xl text-sm leading-relaxed border ${
              feedback.type === "ok" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
              feedback.type === "bad" ? "bg-red-500/10 border-red-500/30 text-red-300" :
              "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}>
              <p className="font-semibold">{feedback.msg}</p>
              <p className="text-xs mt-1 opacity-75">{feedback.exp}</p>
            </div>
          )}
        </div>

        {/* Skip (non-def) */}
        {!answered && q.type !== "def" && (
          <div className="flex justify-end mt-3">
            <button onClick={handleSkip}
              className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-500 text-xs font-semibold hover:text-slate-300 hover:border-slate-700 transition-colors">
              ⏭ Passer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULTS SCREEN
// ─────────────────────────────────────────────
function ResultsScreen({ result, onReplay }) {
  const { lives, correctCount, wrongCount, skippedCount, scoreRaw, total } = result;
  const lost = lives <= 0;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;
  const note20 = total ? Math.max(0, Math.min(20, (Math.max(0, scoreRaw) / total) * 20)) : 0;
  const note20str = Number.isInteger(note20) ? note20 : note20.toFixed(1);

  const mention =
    note20 >= 16 ? { text: "Très bien 🎉", color: "text-emerald-400" } :
    note20 >= 14 ? { text: "Bien 😊",      color: "text-emerald-400" } :
    note20 >= 12 ? { text: "Assez bien 👍", color: "text-yellow-400" } :
    note20 >= 10 ? { text: "Passable 😐",   color: "text-orange-400" } :
                   { text: "À retravailler 📖", color: "text-red-400" };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "radial-gradient(ellipse 90% 60% at 20% 5%, rgba(109,40,217,0.12) 0%, transparent 60%), #020817" }}>
      <div className="w-full max-w-sm text-center">

        <div className="text-6xl mb-4">{lost ? "💔" : pct >= 75 ? "🏆" : pct >= 50 ? "👏" : "📖"}</div>
        <h2 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
          {lost ? "Game Over !" : pct >= 75 ? "Excellent !" : pct >= 50 ? "Bien joué !" : "Continue à réviser !"}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {lost ? "Tu as perdu tous tes cœurs…" : `Quiz terminé — ${total} questions`}
        </p>

        {/* Note /20 */}
        <div className="mb-2">
          <span className="text-6xl font-black" style={{ fontFamily: "'Syne', sans-serif", color: note20 >= 12 ? "#10d98c" : note20 >= 8 ? "#fbbf24" : "#f87171" }}>
            {note20str}
          </span>
          <span className="text-2xl text-slate-500 font-bold">/20</span>
        </div>
        <p className={`text-base font-semibold mb-6 ${mention.color}`}>{mention.text}</p>

        {/* Ring */}
        <div className="mb-6">
          <ScoreRing pct={pct} correct={correctCount} total={total} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { val: correctCount, label: "Bonnes", color: "text-emerald-400", icon: "✅" },
            { val: wrongCount,   label: "Mauvaises", color: "text-red-400", icon: "❌" },
            { val: skippedCount, label: "Passées",   color: "text-amber-400", icon: "⏭" },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl py-4 px-2">
              <div className={`text-2xl font-black ${s.color}`} style={{ fontFamily: "'Syne', sans-serif" }}>{s.val}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.icon} {s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={onReplay}
          className="w-full py-4 rounded-2xl font-bold text-base text-white
            bg-gradient-to-br from-violet-600 to-violet-800
            hover:from-violet-500 hover:to-violet-700
            transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-900/40"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          🔄 Rejouer
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | quiz | results
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);

  const handleStart = (selectedSet) => {
    const qs = shuffle(ALL_QUESTIONS.filter(q => selectedSet.has(q.c)));
    setQuestions(qs);
    setScreen("quiz");
  };

  const handleFinish = (res) => {
    setResult(res);
    setScreen("results");
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');`}</style>
      {screen === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {screen === "quiz"    && <QuizScreen questions={questions} onFinish={handleFinish} />}
      {screen === "results" && <ResultsScreen result={result} onReplay={() => setScreen("welcome")} />}
    </>
  );
}