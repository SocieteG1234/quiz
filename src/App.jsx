import { useState, useCallback, useEffect } from "react";

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

const S = {
  bg:"#050810", surface:"#0d1424", surface2:"#131c2e", border:"#1a2540",
  accent:"#7c3aed", accentLight:"#a78bfa",
  textPrimary:"#f1f5f9", textSecondary:"#94a3b8", textMuted:"#4b5563",
};

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
  { id:"wundt", name:"Wilhelm Wundt", dates:"1832–1920", flag:"🇩🇪", role:"Père fondateur de la psychologie expérimentale", avatar:"W", color:"#7c3aed",
    facts:["Créé le 1er laboratoire de psychologie expérimentale à Leipzig en 1879","Transformé la psychologie de branche philosophique en science rigoureuse","A introduit la méthode introspective en laboratoire","Auteur de plus de 53 000 pages d'œuvres scientifiques"],
    quote:"La psychologie doit être une science naturelle.", chapters:[0] },
  { id:"watson", name:"John B. Watson", dates:"1878–1958", flag:"🇺🇸", role:"Fondateur du béhaviorisme", avatar:"W", color:"#0891b2",
    facts:["Fonde le béhaviorisme en 1913 avec son manifeste 'Psychology as the Behaviorist Views It'","Pour lui, la psychologie ne doit étudier que les comportements OBSERVABLES","Célèbre pour l'expérience du 'Petit Albert'","Définit la psychologie comme science de l'adaptation de la naissance à la mort"],
    quote:"Donnez-moi une douzaine d'enfants sains, bien conformés, et mon propre monde pour les élever…", chapters:[0,5] },
  { id:"pavlov", name:"Ivan Pavlov", dates:"1849–1936", flag:"🇷🇺", role:"Découvreur du conditionnement classique", avatar:"P", color:"#059669",
    facts:["Prix Nobel de Physiologie en 1904 pour ses travaux sur la digestion","Découvre par accident le réflexe conditionné en observant la salivation des chiens","Fondamental pour comprendre l'apprentissage associatif","Ses concepts (SC, SI, RC, RI) sont encore utilisés en thérapie comportementale"],
    quote:"Ne pas cesser d'observer, de chercher, de douter.", chapters:[5] },
  { id:"piaget", name:"Jean Piaget", dates:"1896–1980", flag:"🇨🇭", role:"Fondateur de l'épistémologie génétique", avatar:"P", color:"#d97706",
    facts:["Définit 4 stades universels du développement cognitif (0→adulte)","Introduit les concepts d'assimilation, accommodation et équilibration","Pour lui : le développement PRÉCÈDE l'apprentissage","Fondateur de l'épistémologie génétique (comment se construisent les connaissances)"],
    quote:"L'intelligence, c'est ce qu'on utilise quand on ne sait pas quoi faire.", chapters:[2,5,6] },
  { id:"vygotsky", name:"Lev Vygotsky", dates:"1896–1934", flag:"🇷🇺", role:"Fondateur du socio-constructivisme", avatar:"V", color:"#dc2626",
    facts:["Introduit le concept révolutionnaire de ZPD (Zone Proximale de Développement)","Pour lui : la vraie direction va du SOCIAL à l'INDIVIDUEL","L'apprentissage TIRE le développement (contraire de Piaget)","Mort à 37 ans, mais son oeuvre reste fondamentale en pédagogie"],
    quote:"Ce que l'enfant sait faire aujourd'hui en collaboration, il le fera seul demain.", chapters:[5,6] },
  { id:"bandura", name:"Albert Bandura", dates:"1925–2021", flag:"🇨🇦", role:"Père de la théorie de l'apprentissage social", avatar:"B", color:"#7c3aed",
    facts:["Théorie de l'apprentissage vicariant : on apprend par OBSERVATION d'autrui","Célèbre expérience de la poupée Bobo (1961) : l'agression s'apprend par imitation","Introduit le concept d'auto-efficacité (self-efficacy)","4 processus : attentionnel, rétention, reproduction motrice, motivationnel"],
    quote:"La plupart des comportements humains sont appris par l'observation de modèles.", chapters:[5] },
  { id:"maslow", name:"Abraham Maslow", dates:"1908–1970", flag:"🇺🇸", role:"Fondateur de la psychologie humaniste", avatar:"M", color:"#0891b2",
    facts:["Crée la célèbre pyramide des besoins à 5 niveaux","Les besoins physiologiques ET de sécurité doivent être satisfaits en premier","Seulement 1% des individus atteindraient la réalisation de soi","Sa pyramide est très utilisée en management, sport et pédagogie"],
    quote:"Ce qu'un homme peut être, il doit l'être.", chapters:[3] },
  { id:"freud", name:"Sigmund Freud", dates:"1856–1939", flag:"🇦🇹", role:"Fondateur de la psychanalyse", avatar:"F", color:"#b45309",
    facts:["Fonde la psychanalyse et découvre l'inconscient comme moteur du comportement","Concept du refoulement : on oublie inconsciemment ce qui est douloureux","Développe la méthode des associations libres et l'interprétation des rêves","Divise la psyché en Ça, Moi et Surmoi"],
    quote:"L'inconscient est le vrai psychisme.", chapters:[0,1] },
  { id:"skinner", name:"B.F. Skinner", dates:"1904–1990", flag:"🇺🇸", role:"Père du conditionnement opérant", avatar:"S", color:"#059669",
    facts:["Développe le conditionnement opérant : le comportement est contrôlé par ses conséquences","Invente la boîte de Skinner (chambre d'apprentissage pour animaux)","Distingue renforcement positif, négatif, et punition","Applications : thérapie comportementale, éducation, entraînement sportif"],
    quote:"Le comportement est façonné et maintenu par ses conséquences.", chapters:[5] },
];

const TAG_STYLES = {
  "reformulé":   { bg:"rgba(14,165,233,0.12)",  color:"#38bdf8", border:"rgba(14,165,233,0.3)",  label:"🔄 Reformulé" },
  "synthèse":    { bg:"rgba(168,85,247,0.12)",  color:"#c084fc", border:"rgba(168,85,247,0.3)",  label:"🔗 Synthèse" },
  "application": { bg:"rgba(20,184,166,0.12)",  color:"#2dd4bf", border:"rgba(20,184,166,0.3)",  label:"🏃 Application" },
};

const ALL_QUESTIONS = [
  // ===== CH.0 GÉNÉRALITÉS =====
  { id:1,  c:0, type:"qcm", q:"Que signifie 'psychologie' d'après son étymologie grecque ?", opts:["Science du corps","Science de l'âme et de l'esprit","Science du comportement observable","Science de la société"], ans:1, exp:"Du grec psychê (âme/esprit) + logos (science). Wundt l'a transformée en science expérimentale en 1879." },
  { id:2,  c:0, type:"qcm", q:"Qui a créé le premier laboratoire de psychologie expérimentale ?", opts:["Freud à Vienne en 1895","Watson à Chicago en 1913","Wundt à Leipzig en 1879","Pavlov à Saint-Pétersbourg en 1890"], ans:2, exp:"Wilhelm Wundt (1832-1920) fonda le 1er laboratoire à Leipzig en 1879." },
  { id:3,  c:0, type:"qcm", q:"Selon Watson (1913), quel est l'objet de la psychologie ?", opts:["L'étude de l'inconscient","L'étude de ce que font les êtres vivants de leur naissance à leur mort","L'étude des processus mentaux internes","L'étude des émotions et de la personnalité"], ans:1, exp:"Watson (1913) : psychologie = science de l'adaptation des faits humains de la naissance à la mort." },
  { id:4,  c:0, type:"qcm", q:"Quelles sont les 3 méthodes de la psychologie selon le cours ?", opts:["Observation, expérimentation, questionnaire","Introspective, clinique et expérimentale","Qualitative, quantitative et mixte","Béhavioriste, cognitive et psychanalytique"], ans:1, exp:"Les 3 méthodes : introspective, clinique (questionnaire, entretien, test) et expérimentale." },
  { id:5,  c:0, type:"qcm", q:"Dans la méthode expérimentale, qu'est-ce que la Variable Indépendante (VI) ?", opts:["L'effet observé","La cause manipulée par l'expérimentateur","La réponse du sujet","Le comportement mesuré"], ans:1, exp:"VI = cause manipulée. VD (Variable Dépendante) = effet observé/mesuré." },
  { id:6,  c:0, type:"qcm", q:"Combien d'étapes comporte la démarche expérimentale ?", opts:["2","3","4","5"], ans:2, exp:"4 étapes : formulation du problème → hypothèse → mise à l'épreuve → conclusion." },
  { id:7,  c:0, type:"qcm", q:"Qui est le pionnier de la psychologie du sport en France ?", opts:["Wilhelm Wundt","Sigmund Freud","Georges Rioux","Jean Piaget"], ans:2, exp:"Georges Rioux, professeur à l'Université de Tours, pionnier de la psychologie du sport en France." },
  { id:8,  c:0, type:"qcm", q:"Quelle critique principale fait-on à la méthode introspective ?", opts:["Elle est trop coûteuse","Les informations sont subjectives et non vérifiables","Elle ne peut pas étudier les adultes","Elle nécessite des instruments complexes"], ans:1, exp:"L'introspection est subjective : un observateur ne peut vérifier ce que le sujet rapporte." },
  { id:9,  c:0, type:"qcm", q:"Les caractéristiques essentielles d'un test psychologique sont :", opts:["Fiabilité, validité, sensibilité","Objectivité, subjectivité, neutralité","Rapidité, précision, économie","Standardisation, normalisation, étalonnage"], ans:0, exp:"Un bon test : fidèle, valide (mesure ce qu'il prétend mesurer), sensible (différencie les individus)." },
  { id:10, c:0, type:"qcm", q:"Jusqu'à quand la psychologie était-elle une branche de la philosophie ?", opts:["Jusqu'en 1700","Jusqu'en 1870","Jusqu'en 1913","Jusqu'en 1950"], ans:1, exp:"Jusqu'en 1870, la psychologie s'inscrivait dans la philosophie. Wundt en 1879 lui donna le statut de science." },
  { id:11, c:0, type:"qcm", q:"Combien de types d'entretien existent dans la méthode clinique ?", opts:["1","2","3","4"], ans:2, exp:"3 types d'entretien : directif, semi-directif, non directif." },
  { id:12, c:0, type:"qcm", q:"Le principe de déterminisme causal signifie :", opts:["Tout est aléatoire","Tout effet est produit par une cause","La liberté détermine le comportement","L'environnement seul explique tout"], ans:1, exp:"Déterminisme causal : tout effet est produit par une cause (base de la méthode expérimentale)." },
  { id:13, c:0, type:"vf", q:"La psychologie béhavioriste étudie principalement les processus inconscients.", ans:false, exp:"Faux. Le béhaviorisme (Watson) étudie UNIQUEMENT les comportements observables et mesurables." },
  { id:14, c:0, type:"vf", q:"Jusqu'en 1870, la psychologie était une branche de la philosophie.", ans:true, exp:"Vrai. De l'Antiquité jusqu'en 1870, la psychologie s'inscrivait dans l'histoire de la philosophie." },
  { id:15, c:0, type:"vf", q:"L'hypothèse est une affirmation définitive et prouvée sur un comportement.", ans:false, exp:"Faux. L'hypothèse est une réponse anticipée et PROVISOIRE. Elle doit être testée." },
  { id:16, c:0, type:"vf", q:"Wundt est à la fois philosophe et fondateur de la psychologie expérimentale.", ans:true, exp:"Vrai. Wundt était philosophe qui a rendu scientifique l'étude du comportement humain." },
  { id:17, c:0, type:"def", q:"Définissez la PSYCHOLOGIE selon le cours.", answer:"La psychologie est la science qui étudie le comportement des individus et leurs processus mentaux (intelligence, langage, mémoire). Son objet est le comportement humain sous tous ses aspects psychiques, normaux ou pathologiques.", keywords:["comportement","processus mentaux","science","individus","normaux","pathologiques"], exp:"Étymologie : psychê (âme) + logos (science)." },
  { id:18, c:0, type:"def", q:"Définissez la MÉTHODE EXPÉRIMENTALE en psychologie.", answer:"Méthode fondée sur le déterminisme causal. L'expérimentateur manipule des variables indépendantes (VI) et observe leurs effets sur la variable dépendante (VD). 4 étapes : formulation d'un problème, hypothèse, mise à l'épreuve, conclusion.", keywords:["déterminisme causal","variable indépendante","variable dépendante","hypothèse","4 étapes"], exp:"Observation = phénomène naturel. Expérimentation = phénomène provoqué." },
  { id:19, c:0, type:"qcm", q:"Quand la psychologie a-t-elle connu ses prémices, son développement et son plein essor ?", opts:["XVIe siècle / XVIIe / XVIIIe siècle","XVIe siècle / XIXe / XXe siècle","XVIIe siècle / XVIIIe / XIXe siècle","XIXe siècle / XXe / XXIe siècle"], ans:1, exp:"La psychologie a connu ses prémices au XVIe siècle, son développement au XIXe siècle et son plein essor au XXe siècle." },
  { id:20, c:0, type:"qcm", q:"Quelle est la méthode introspective en psychologie ?", opts:["L'étude du comportement observable","Une observation interne par laquelle la conscience s'observe directement elle-même","L'étude des variables indépendantes","La mesure du comportement par des tests standardisés"], ans:1, exp:"L'introspection = observation interne, opération par laquelle la conscience s'observe directement elle-même." },
  { id:21, c:0, type:"qcm", q:"Quelles sont les 3 critiques majeures de la méthode introspective ?", opts:["Trop coûteuse, trop longue, trop complexe","Informations subjectives non vérifiables, ne renseigne pas sur la situation réelle, impossible avec jeunes enfants et animaux","Difficile à standardiser, résultats non reproductibles","Ne s'applique pas aux humains adultes"], ans:1, exp:"3 critiques : 1) Ne renseigne pas sur la situation réelle. 2) Informations subjectives non vérifiables. 3) Impossible avec jeunes enfants et animaux." },
  { id:22, c:0, type:"qcm", q:"Qu'est-ce que la méthode clinique en psychologie ?", opts:["Uniquement l'utilisation de tests standardisés","L'étude approfondie d'individus particuliers par des techniques d'investigation (questionnaire, entretien, test, observation)","La méthode expérimentale appliquée en milieu hospitalier","L'observation systématique de groupes de sujets"], ans:1, exp:"La méthode clinique : étude approfondie d'individus particuliers par questionnaire, entretien, test, observation." },
  { id:23, c:0, type:"qcm", q:"Combien de grandes catégories de questions distingue-t-on dans les questionnaires ?", opts:["2 (ouvertes et fermées)","3 (fermées, ouvertes, semi-ouvertes)","4 types","5 types"], ans:1, exp:"3 grandes catégories : questions fermées, questions ouvertes et questions semi-ouvertes." },
  { id:24, c:0, type:"qcm", q:"Qu'est-ce qu'un test psychologique selon le cours ?", opts:["Un entretien approfondi avec le clinicien","Une épreuve standardisée servant de stimulus à un comportement évalué par comparaison avec d'autres individus","Un questionnaire ouvert sur les attitudes","Une observation non structurée du comportement"], ans:1, exp:"Le test = épreuve standardisée servant de stimulus à un comportement, évalué par comparaison avec d'autres individus placés dans la même situation." },
  { id:25, c:0, type:"qcm", q:"Qu'est-ce que la VALIDITÉ d'un test psychologique ?", opts:["Le test mesure la même chose à chaque passation","Le test mesure bien ce qu'il est censé mesurer et prédit le comportement du sujet","Le test différencie suffisamment les sujets","Le test est facile à administrer"], ans:1, exp:"Validité = le test mesure bien ce qu'il est censé mesurer ET prédit ce que le sujet va faire." },
  { id:26, c:0, type:"qcm", q:"Qu'est-ce que la FIDÉLITÉ d'un test psychologique ?", opts:["Le test mesure ce qu'il prétend mesurer","Le test présente une fidélité et une validité adéquate","Le test comporte plus ou moins d'échelons","Le même individu passe plusieurs fois le test et obtient sensiblement les mêmes résultats"], ans:3, exp:"Fidélité = le même individu passe plusieurs fois le test et obtient sensiblement les mêmes résultats (stabilité de la mesure)." },
  { id:27, c:0, type:"qcm", q:"La psychologie du sport étudie principalement :", opts:["Les techniques sportives et la biomécanique","Les processus psychiques et la conduite de l'homme pendant l'activité sportive","Les règles des sports collectifs","La physiologie de l'effort sportif"], ans:1, exp:"La psychologie du sport étudie les processus psychiques et la conduite de l'homme pendant l'activité sportive." },
  { id:28, c:0, type:"qcm", q:"Quelle est la différence entre COMPORTEMENT et ATTITUDE ?", opts:["Ce sont des synonymes","Le comportement est visible alors que l'attitude n'est pas visible, mais l'attitude peut justifier le comportement","L'attitude est toujours observable, le comportement non","L'attitude est innée, le comportement est appris"], ans:1, exp:"Comportement = visible/observable. Attitude = non visible. Mais l'attitude peut justifier le comportement." },
  { id:29, c:0, type:"qcm", q:"Selon le cours, quels sont les axes de spécialisation de la psychologie ?", opts:["Le normal, le pathologique, le biologique, le social, les influences mixtes","Le cognitif, l'affectif, le comportemental","Le clinique, l'éducatif, le sportif","L'expérimental, le théorique, l'appliqué"], ans:0, exp:"5 axes : le normal, le pathologique, le biologique, le social et les influences mixtes (dont psychologie du sport)." },
  { id:30, c:0, type:"qcm", q:"L'entretien intentionnel en psychologie clinique se distingue par :", opts:["L'utilisation de tests standardisés","Une rencontre interpersonnelle lors de laquelle le clinicien essaie d'obtenir des informations sur le comportement du sujet","L'observation du comportement de loin","L'utilisation d'un questionnaire écrit"], ans:1, exp:"L'entretien intentionnel = rencontre interpersonnelle lors de laquelle le clinicien essaie d'obtenir des informations sur le comportement du sujet." },
  { id:31, c:0, type:"vf", q:"La méthode introspective peut facilement s'appliquer aux jeunes enfants qui ne parlent pas.", ans:false, exp:"Faux. C'est une critique majeure de l'introspection : elle est impossible avec les sujets très jeunes qui ne maîtrisent pas le langage, et avec les animaux." },
  { id:32, c:0, type:"vf", q:"La psychologie du sport peut aider l'athlète à contrôler le stress et la concentration.", ans:true, exp:"Vrai. Le psychologue du sport aide l'athlète à contrôler le stress (désorganisation émotionnelle et comportementale), et travaille sur la concentration et la motivation." },
  { id:33, c:0, type:"vf", q:"Dans la méthode expérimentale, la variable dépendante (VD) est la cause que l'expérimentateur manipule.", ans:false, exp:"Faux. La VI (Variable Indépendante) est la CAUSE manipulée. La VD (Variable Dépendante) est l'EFFET observé/mesuré." },
  { id:34, c:0, type:"vf", q:"La sensibilité d'un test psychologique permet de différencier les sujets entre eux.", ans:true, exp:"Vrai. La sensibilité = le test comporte suffisamment d'échelons pour différencier finement les sujets entre eux." },
  { id:35, c:0, type:"def", q:"Définissez la MÉTHODE CLINIQUE et ses 4 outils principaux.", answer:"La méthode clinique consiste à étudier de façon approfondie des individus particuliers par des techniques d'investigation pouvant être ou non normalisées. Ses 4 outils principaux sont : le questionnaire (ensemble de questions méthodiquement posées), l'entretien (directif, semi-directif, non directif), le test (épreuve standardisée comparée à des normes) et l'observation (armée ou non).", keywords:["approfondie","individus particuliers","questionnaire","entretien","test","observation","normalisées"], exp:"3 types d'entretien : directif, semi-directif, non directif." },
  { id:36, c:0, type:"def", q:"Définissez la PSYCHOLOGIE DU SPORT et son objet.", answer:"La psychologie du sport est la branche de la psychologie qui étudie les processus psychiques et la conduite de l'homme pendant l'activité sportive. Elle cherche à connaître et optimiser les conditions internes du sportif pour l'expression de son potentiel physique, technique et tactique. Elle étudie les aptitudes mentales et psychologiques qui déterminent la performance sportive.", keywords:["processus psychiques","conduite","activité sportive","optimiser","potentiel","performance","aptitudes mentales"], exp:"Le consultant en préparation mentale travaille sur : concentration, motivation, gestion du stress." },

  // ===== CH.1 MÉMOIRE =====
  { id:100, c:1, type:"qcm", q:"Quelles sont les 3 étapes de la mémoire comme système de traitement ?", opts:["Attention, perception, mémorisation","Encodage, rétention/stockage, récupération","Apprentissage, consolidation, oubli","Codage, décodage, rappel"], ans:1, exp:"Encodage → Rétention/Stockage → Récupération." },
  { id:101, c:1, type:"qcm", q:"Quelle mémoire stocke les savoir-faire et gestes automatisés ?", opts:["Mémoire épisodique","Mémoire sémantique","Mémoire procédurale","Mémoire sensorielle"], ans:2, exp:"La mémoire procédurale stocke les capacités perceptuelles, cognitives et motrices." },
  { id:102, c:1, type:"qcm", q:"Combien de temps dure environ la mémoire sensorielle ?", opts:["0,5 seconde","5 secondes","30 secondes","5 minutes"], ans:0, exp:"La mémoire sensorielle maintient l'information environ 0,5 seconde." },
  { id:103, c:1, type:"qcm", q:"Selon Paivio (1976), les informations sont représentées de combien de façons ?", opts:["1 (uniquement verbale)","2 (code image et code verbal)","3 (visuelle, auditive, kinesthésique)","4"], ans:1, exp:"Théorie du double codage : code image (concret) + code verbal (abstrait)." },
  { id:104, c:1, type:"qcm", q:"Quel neurotransmetteur est déficient dans la maladie d'Alzheimer ?", opts:["Dopamine","Sérotonine","Acétylcholine","Adrénaline"], ans:2, exp:"L'acétylcholine est crucial pour la mémoire. Sa pénurie explique la maladie d'Alzheimer." },
  { id:105, c:1, type:"qcm", q:"Quelle structure cérébrale est impliquée dans l'encodage de la mémoire déclarative ?", opts:["Le cortex frontal","L'hippocampe","Le cervelet","Le cortex moteur"], ans:1, exp:"L'hippocampe : encodage, consolidation, rappel des souvenirs déclaratifs." },
  { id:106, c:1, type:"qcm", q:"Selon Gates (1968), quelle est la principale façon d'améliorer la mémoire ?", opts:["La mémorisation mécanique","La récapitulation (feed-back)","La relecture passive","L'apprentissage incident"], ans:1, exp:"Gates (1968) : récapitulation (feed-back), sélection, sur-apprentissage, codage profond, sommeil." },
  { id:107, c:1, type:"qcm", q:"L'oubli selon Freud est souvent le résultat de :", opts:["Manque de répétition","Codage trop superficiel","Refoulement inconscient","Interférence proactive"], ans:2, exp:"Pour Freud, on oublie inconsciemment ce qui est douloureux ou conflictuel : c'est le refoulement." },
  { id:108, c:1, type:"qcm", q:"Quelle pathologie touche les alcooliques chroniques et l'hippocampe ?", opts:["Alzheimer","Prosopagnosie","Amnésie de Korsakoff","Acalculie"], ans:2, exp:"L'amnésie de Korsakoff touche toutes les zones du cerveau, surtout l'hippocampe." },
  { id:109, c:1, type:"qcm", q:"La prosopagnosie est due à :", opts:["Une lésion de l'hippocampe","Une lésion de l'hémisphère droit","Un manque d'acétylcholine","Un abus d'alcool"], ans:1, exp:"La prosopagnosie (incapacité à reconnaître les visages) est due à une lésion de l'hémisphère droit." },
  { id:110, c:1, type:"vf", q:"La mémoire à court terme (MCT) a une capacité de stockage illimitée.", ans:false, exp:"Faux. La MCT a une capacité LIMITÉE à quelques éléments. C'est la MLT qui a une capacité illimitée." },
  { id:111, c:1, type:"vf", q:"Plus le traitement est profond, plus la trace mnésique est durable.", ans:true, exp:"Vrai. L'efficacité de la mémoire est fonction du codage superficiel ou profond." },
  { id:112, c:1, type:"vf", q:"Le stress améliore toujours la mémoire.", ans:false, exp:"Faux. Le stress libère des glucocorticoïdes qui perturbent l'encodage dans l'hippocampe." },
  { id:113, c:1, type:"vf", q:"L'acétylcholine est un neurotransmetteur important pour la mémoire.", ans:true, exp:"Vrai. Sa pénurie explique les troubles d'Alzheimer." },
  { id:114, c:1, type:"vf", q:"La mémoire implicite nécessite un effort conscient de récupération.", ans:false, exp:"Faux. La mémoire implicite s'utilise SANS effort conscient." },
  { id:115, c:1, type:"def", q:"Définissez la MÉMOIRE selon le cours.", answer:"La mémoire est la capacité d'un système naturel ou artificiel à encoder l'information extraite de son expérience, à la stocker dans un format approprié, puis à la récupérer pour l'utiliser dans ses actions.", keywords:["encoder","stocker","récupérer","expérience","système"], exp:"3 étapes : encodage → rétention/stockage → récupération." },
  { id:116, c:1, type:"def", q:"Expliquez la différence entre MÉMOIRE DÉCLARATIVE et MÉMOIRE PROCÉDURALE.", answer:"La mémoire déclarative concerne les souvenirs de faits et d'événements (savoir QUE). La mémoire procédurale concerne les savoir-faire, gestes et automatismes (savoir COMMENT faire : nager, dribbler).", keywords:["déclarative","faits","événements","procédurale","savoir-faire","automatismes"], exp:"Ex : se souvenir de son anniversaire = déclarative. Savoir nager = procédurale." },
  { id:117, c:1, type:"qcm", q:"Selon Paivio (1976), quel type de mots est le moins bien retenu en mémoire ?", opts:["Les mots concrets (chemise, chaussure)","Les mots abstraits (intelligence, orgueil)","Les mots courts","Les mots techniques"], ans:1, exp:"Plus les mots sont abstraits, moins on est capable de susciter une image mentale et moins ils sont retenus." },
  { id:118, c:1, type:"qcm", q:"Quelles sont les 2 méthodes de récupération des informations en mémoire ?", opts:["Encodage et stockage","Rappel et reconnaissance","Mémoire iconique et échoïque","Mémoire à court terme et long terme"], ans:1, exp:"2 méthodes : le rappel (libre ou sériel) et la reconnaissance (identifier les éléments présentés lors de l'apprentissage)." },
  { id:119, c:1, type:"qcm", q:"Qu'est-ce que la mémoire iconique ?", opts:["La mémoire des sons","La mémoire sensorielle visuelle de très courte durée (0,5 sec)","La mémoire des faits historiques","La mémoire des gestes sportifs"], ans:1, exp:"La mémoire iconique est la mémoire sensorielle visuelle. La mémoire échoïque est la mémoire sensorielle auditive." },
  { id:120, c:1, type:"qcm", q:"Quelle structure cérébrale est impliquée dans les émotions ET joue un rôle majeur dans la mémoire ?", opts:["Le cortex préfrontal","Le cervelet","L'amygdale","Le thalamus"], ans:2, exp:"L'amygdale est impliquée dans les émotions, qui jouent un rôle majeur dans la mémoire." },
  { id:121, c:1, type:"qcm", q:"Qu'est-ce que l'acalculie ?", opts:["Incapacité à reconnaître les visages","Perte de mémoire due à l'alcool","Amnésie des chiffres par lésion du cortex moteur (aire de Broca)","Trouble du langage"], ans:2, exp:"L'acalculie est une amnésie des chiffres. Elle survient quand la lésion est à l'aire de Broca (cortex moteur)." },
  { id:122, c:1, type:"qcm", q:"Parmi ces facteurs, lequel N'explique PAS l'oubli selon le cours ?", opts:["Le manque de répétition","Le codage superficiel","Le phénomène d'interférence","Un QI élevé"], ans:3, exp:"L'oubli s'explique par : manque de répétition, manque d'attention, codage superficiel, interférence, affectivité, alcool. Le QI n'est pas un facteur d'oubli." },
  { id:123, c:1, type:"qcm", q:"La mémoire collective, selon la psychologie sociale, est :", opts:["Toujours objective et fiable","Sélective : elle renforce certains souvenirs au détriment d'autres (oubli induit)","Identique à la mémoire individuelle","Uniquement stockée dans les livres"], ans:1, exp:"La communication renforce sélectivement certains souvenirs au détriment des autres : c'est l'oubli induit. La mémoire collective est sélective." },
  { id:124, c:1, type:"vf", q:"La mémoire à long terme (MLT) a une capacité illimitée sous réserve de l'intégrité du SNC.", ans:true, exp:"Vrai. La MLT a une capacité illimitée, contrairement à la MCT dont la capacité est limitée à quelques éléments." },
  { id:125, c:1, type:"vf", q:"La lésion de l'aire de Broca (cortex moteur) provoque une prosopagnosie.", ans:false, exp:"Faux. La lésion de l'aire de Broca provoque des PROBLÈMES DE LANGAGE. La prosopagnosie vient d'une lésion de l'hémisphère droit." },
  { id:126, c:1, type:"vf", q:"Selon Kosslyn et Pylyshyn, plus le traitement de l'information est profond, plus la trace mnésique est durable.", ans:true, exp:"Vrai. L'efficacité de la mémoire est fonction du codage : plus le traitement est profond, plus la trace mnésique est longue et durable." },
  { id:127, c:1, type:"def", q:"Expliquez la différence entre RAPPEL et RECONNAISSANCE comme méthodes de récupération.", answer:"Le rappel consiste à restituer l'information librement (rappel libre : dans n'importe quel ordre) ou de façon sérielle (ordre donné). La reconnaissance consiste à présenter après étude des éléments appartenant ou non au matériel étudié. Le sujet doit identifier les éléments présentés lors de l'apprentissage. Le score = reconnus moins les fausses reconnaissances.", keywords:["rappel","libre","sériel","reconnaissance","identifier","fausses reconnaissances","indice"], exp:"La reconnaissance est généralement plus facile car elle fournit des indices." },

  // ===== CH.2 INTELLIGENCE =====
  { id:200, c:2, type:"qcm", q:"Selon William Stern (1912), comment se calcule le QI ?", opts:["QI = Âge Réel / Âge Mental × 100","QI = Âge Mental / Âge Réel × 100","QI = (AM + AR) / 2","QI = AM × AR / 100"], ans:1, exp:"William Stern (1912) : QI = Âge Mental / Âge Réel × 100. La moyenne est fixée à 100." },
  { id:201, c:2, type:"qcm", q:"Le test Binet-Simon couvre les enfants de quel âge ?", opts:["0 à 6 ans","3 à 13 ans","6 à 18 ans","Tous les âges"], ans:1, exp:"Le test Binet-Simon est une échelle de développement pour les enfants de 3 à 13 ans." },
  { id:202, c:2, type:"qcm", q:"Quels sont les 3 facteurs de développement de l'intelligence selon Piaget ?", opts:["Hérédité, environnement, hasard","Maturation neurologique, exercice/expérience, interactions sociales","QI, EQ, CI","Génétique, alimentation, éducation"], ans:1, exp:"3 facteurs : maturation neurologique, exercice et expérience, interactions sociales." },
  { id:203, c:2, type:"qcm", q:"À quel stade de Piaget l'enfant développe-t-il la pensée symbolique et le jeu ?", opts:["Sensori-moteur","Pré-opératoire","Opérations concrètes","Opérations formelles"], ans:1, exp:"Stade pré-opératoire (2-7 ans) : fonction symbolique (langage, jeu, dessin). Mais égocentrisme cognitif." },
  { id:204, c:2, type:"qcm", q:"Qu'est-ce que l'égocentrisme cognitif de Piaget ?", opts:["Un défaut de caractère","L'incapacité à prendre le point de vue d'autrui","Un retard mental","Une forme d'autisme"], ans:1, exp:"L'égocentrisme de Piaget est COGNITIF, pas moral. L'enfant ne peut pas encore prendre le point de vue de l'autre." },
  { id:205, c:2, type:"qcm", q:"À quel stade l'enfant accède-t-il à la notion de réversibilité ?", opts:["Sensori-moteur","Pré-opératoire","Opérations concrètes","Opérations formelles"], ans:2, exp:"Stade opératoire concret (7-12 ans) : réversibilité, conservation des mesures, classifications." },
  { id:206, c:2, type:"qcm", q:"Qu'est-ce que la réification de l'intelligence ?", opts:["L'idée que l'intelligence peut être développée","L'idée fausse que l'intelligence est fixe, innée","La mesure de l'intelligence par des tests","La transmission de l'intelligence de parent à enfant"], ans:1, exp:"Réification = croire que l'intelligence est une chose fixe, innée. Associée à l'héréditarisme (Goddard)." },
  { id:207, c:2, type:"qcm", q:"Selon Terman, l'intelligence est :", opts:["La capacité à fournir de bonnes réponses","L'aptitude à maîtriser une pensée abstraite","La capacité d'apprendre dans son environnement","La capacité à s'adapter à des situations nouvelles"], ans:1, exp:"Terman : l'intelligence = aptitude à maîtriser une pensée abstraite." },
  { id:208, c:2, type:"qcm", q:"Le stade des Opérations Formelles commence vers :", opts:["5 ans","7 ans","11-12 ans","18 ans"], ans:2, exp:"Opérations Formelles (11-12 ans+) : pensée abstraite, raisonnement hypothético-déductif." },
  { id:209, c:2, type:"qcm", q:"L'accommodation selon Piaget correspond à :", opts:["Intégrer le nouveau dans les schèmes existants","Modifier les schèmes en fonction des données nouvelles du milieu","L'équilibre entre assimilation et accommodation","Refuser toute nouvelle information"], ans:1, exp:"Accommodation = transformer les schèmes existants pour intégrer les nouvelles informations." },
  { id:210, c:2, type:"vf", q:"Le QI mesure la totalité de l'intelligence d'un individu.", ans:false, exp:"Faux. Le QI ne mesure qu'une partie (analytique/logique). Il ne mesure pas les intelligences motrices, musicales, sociales." },
  { id:211, c:2, type:"vf", q:"Selon Piaget, le stade sensori-moteur dure de 0 à 18-24 mois.", ans:true, exp:"Vrai. Stade sensori-moteur (0-18/24 mois) : réflexes, réactions circulaires." },
  { id:212, c:2, type:"vf", q:"Pour Piaget, tous les enfants passent par les mêmes stades dans le même ordre.", ans:true, exp:"Vrai. Les stades sont universels et invariants. Le rythme et la durée varient." },
  { id:213, c:2, type:"vf", q:"Goddard visait à intégrer les personnes moins intelligentes dans la société.", ans:false, exp:"Faux. Goddard visait à les ÉCARTER. Position réfutée aujourd'hui." },
  { id:214, c:2, type:"def", q:"Définissez l'ASSIMILATION et l'ACCOMMODATION selon Piaget.", answer:"L'assimilation est l'intégration des données de l'expérience dans la structure existante de l'individu. L'accommodation est la modification de la structure de l'individu en fonction des données nouvelles du milieu. L'adaptation est l'équilibre entre les deux.", keywords:["assimilation","intégration","accommodation","modification","adaptation","équilibre"], exp:"L'intelligence se construit par l'interaction de ces deux mécanismes." },
  { id:215, c:2, type:"def", q:"Décrivez les 4 stades de Piaget avec leurs âges.", answer:"1. Sensori-Moteur (0-18/24 mois) : réflexes, réactions circulaires. 2. Pré-Opératoire (2-7 ans) : pensée symbolique, égocentrisme cognitif. 3. Opérations Concrètes (7-12 ans) : réversibilité, conservation. 4. Opérations Formelles (11-12 ans+) : raisonnement hypothético-déductif, pensée abstraite.", keywords:["sensori-moteur","pré-opératoire","opérations concrètes","opérations formelles","réversibilité"], exp:"Les stades sont universels et invariants. Chaque stade intègre et dépasse le précédent." },
  { id:216, c:2, type:"qcm", q:"Selon Colvin, l'intelligence est :", opts:["L'aptitude à maîtriser une pensée abstraite","La capacité de fournir de bonnes réponses","Le fait d'avoir appris ou d'avoir la capacité d'apprendre dans son environnement","La capacité à s'adapter à des situations nouvelles"], ans:2, exp:"Colvin : l'intelligence est le fait d'avoir appris ou avoir la capacité d'apprendre dans son environnement." },
  { id:217, c:2, type:"qcm", q:"Selon Pintner, l'intelligence est :", opts:["L'aptitude à la pensée abstraite","La capacité à apprendre dans son environnement","La capacité à s'adapter adéquatement à des situations nouvelles","La capacité à fournir de bonnes réponses"], ans:2, exp:"Pintner : l'intelligence est la capacité à s'adapter adéquatement à des situations nouvelles." },
  { id:218, c:2, type:"qcm", q:"Quel était le but initial du test Binet-Simon ?", opts:["Classer les élèves par niveau de QI","Dépister le retard de l'enfant afin de lui faire un programme adapté","Exclure les moins intelligents de la société","Mesurer les capacités sportives"], ans:1, exp:"Binet : le test vise à dépister le retard de l'enfant pour lui proposer un programme adapté, pas pour le stigmatiser." },
  { id:219, c:2, type:"qcm", q:"Qu'est-ce que l'héréditarisme ?", opts:["L'idée que l'intelligence se développe avec l'expérience","L'idée qu'on hérite de l'intelligence de ses parents","La théorie selon laquelle l'environnement façonne l'intelligence","La méthode expérimentale pour mesurer l'intelligence"], ans:1, exp:"Héréditarisme = idée qu'on hérite de l'intelligence des parents, liée à la réification. Ces idées ont conduit à justifier les hiérarchies sociales." },
  { id:220, c:2, type:"qcm", q:"Selon la synthèse du cours, l'intelligence est :", opts:["Uniquement la vitesse de traitement de l'information","Le fait de réfléchir, résoudre un problème avec des connaissances, se conduire de façon adaptée","Une capacité innée et fixe non modifiable","La capacité à passer des tests"], ans:1, exp:"Synthèse : l'intelligence = réfléchir, résoudre un problème avec des connaissances, se conduire de façon adaptée par rapport à l'environnement." },
  { id:221, c:2, type:"qcm", q:"Au stade Sensori-Moteur, que développe principalement le bébé ?", opts:["Le langage et le jeu symbolique","Des actions réflexes, réactions circulaires, schémas d'action","Le raisonnement hypothético-déductif","La notion de conservation des mesures"], ans:1, exp:"Stade Sensori-Moteur (0-24 mois) : réflexes, réactions circulaires, schémas d'action qui se complexifient et se coordonnent." },
  { id:222, c:2, type:"qcm", q:"Au stade des Opérations Concrètes, l'enfant acquiert principalement :", opts:["Le jeu symbolique et l'imitation ludique","La pensée abstraite et hypothético-déductive","La réversibilité, la conservation des mesures et les classements","Uniquement les réflexes innés"], ans:2, exp:"Opérations Concrètes (7-12 ans) : réversibilité, conservation des mesures, classements. L'enfant accepte le point de vue des autres." },
  { id:223, c:2, type:"vf", q:"Selon Binet, un enfant dépisté comme ayant des problèmes intellectuels doit être considéré comme congénitalement inapte.", ans:false, exp:"Faux. Binet précise qu'un enfant dépisté ne peut pas être considéré comme congénitalement inapte. Les causes des différences sont très nombreuses." },
  { id:224, c:2, type:"vf", q:"Selon Thorndike, l'intelligence est la capacité à fournir de bonnes réponses du point de vue de la vérité et des faits.", ans:true, exp:"Vrai. Thorndike définit l'intelligence comme la capacité de fournir de bonnes réponses du point de vue de la vérité et des faits." },
  { id:225, c:2, type:"def", q:"Définissez le QI selon William Stern et donnez sa formule.", answer:"Le QI (Quotient Intellectuel) a été défini par William Stern en 1912 comme le rapport entre l'âge mental et l'âge réel du sujet. Formule : QI = Âge Mental / Âge Réel × 100. La moyenne des enfants d'un âge donné est la note 100. Le QI est défini par un test ou par convention.", keywords:["QI","Stern","âge mental","âge réel","formule","100","rapport","1912"], exp:"QI = AM / AR × 100. La moyenne est fixée à 100." },

  // ===== CH.3 MOTIVATION =====
  { id:300, c:3, type:"qcm", q:"Selon Goldenson (1970), la motivation est :", opts:["L'ensemble des besoins biologiques","La dynamique du comportement et de son maintien","La récompense obtenue après un effort","La pression sociale exercée sur l'individu"], ans:1, exp:"Goldenson (1970) : la motivation est la dynamique du comportement et de son maintien." },
  { id:301, c:3, type:"qcm", q:"Quelles sont les 3 grandes catégories de motivation ?", opts:["Intrinsèque, extrinsèque, mixte","Biologique, psychologique, sociale","Fondamentales, besoins de stimulation, acquises secondaires","Primaires, secondaires, tertiaires"], ans:2, exp:"3 catégories : fondamentales (besoins biologiques), besoins de stimulation (curiosité), acquises secondaires (puissance, prestige)." },
  { id:302, c:3, type:"qcm", q:"Qui a introduit le concept d'homéostasie en 1926 ?", opts:["Maslow","Freud","Cannon","Butler"], ans:2, exp:"Cannon (1926) : homéostasie = état d'équilibre du milieu interne." },
  { id:303, c:3, type:"qcm", q:"Dans la pyramide de Maslow, quel besoin est au sommet ?", opts:["Sécurité","Appartenance","Estime personnelle","Réalisation de soi"], ans:3, exp:"Sommet = réalisation de soi (niveau 5). Maslow : niveaux 4 et 5 rarement atteints." },
  { id:304, c:3, type:"qcm", q:"Qu'est-ce que l'hospitalisme selon Spitz ?", opts:["Une maladie infectieuse","Un état d'altération physique chez les nourrissons privés d'affection","Un trouble de la mémoire","Un syndrome d'anxiété de séparation"], ans:1, exp:"Spitz : l'hospitalisme = altération physique profonde chez de très jeunes enfants avec carence affective." },
  { id:305, c:3, type:"qcm", q:"Selon Mac Clelland (1961), les personnes à fort besoin de réussite :", opts:["Choisissent des objectifs impossibles","Choisissent des défis intermédiaires","Évitent toute situation d'évaluation","Attribuent leur échec à la malchance"], ans:1, exp:"Mac Clelland (1961) : fort besoin de réussite → défis intermédiaires (ni trop faciles, ni impossibles)." },
  { id:306, c:3, type:"qcm", q:"Qu'a montré Harlon sur la motivation intrinsèque ?", opts:["Les récompenses augmentent toujours la motivation","Les singes récompensés jouaient MOINS par la suite","Les récompenses n'ont aucun effet","La motivation intrinsèque se développe avec la pratique"], ans:1, exp:"Harlon : les singes récompensés jouaient moins par la suite → le renforcement tue la motivation intrinsèque." },
  { id:307, c:3, type:"qcm", q:"L'attachement selon Bowlby est :", opts:["Un besoin secondaire acquis","Une tendance primaire et permanente à rechercher le contact avec un congénère","Un réflexe conditionné","Un besoin uniquement humain"], ans:1, exp:"Bowlby : attachement = tendance à rechercher le contact avec un congénère. C'est un besoin primaire et permanent." },
  { id:308, c:3, type:"vf", q:"Selon Maslow, les besoins physiologiques doivent être satisfaits avant d'accéder aux besoins supérieurs.", ans:true, exp:"Vrai. Maslow : besoins physiologiques et de sécurité DOIVENT être satisfaits pour accéder aux besoins supérieurs." },
  { id:309, c:3, type:"vf", q:"La motivation extrinsèque (récompenses) augmente toujours la motivation intrinsèque.", ans:false, exp:"Faux. Harlon et Deci ont montré que les récompenses externes DIMINUENT la motivation intrinsèque." },
  { id:310, c:3, type:"vf", q:"Selon Bowlby, le besoin d'attachement est aussi important que les besoins physiologiques.", ans:true, exp:"Vrai. Le besoin de contact et de stimulation est aussi important pour la survie du nourrisson." },
  { id:311, c:3, type:"vf", q:"Pour Deci, les récompenses monétaires diminuent la motivation intrinsèque.", ans:true, exp:"Vrai. Deci : la motivation intrinsèque est diminuée par tout ce qui est perçu comme un contrôle." },
  { id:312, c:3, type:"def", q:"Définissez la MOTIVATION selon le cours.", answer:"La motivation est l'ensemble des mécanismes biologiques et physiologiques qui permettent le déclenchement de l'action, son orientation, son intensité et sa persistance. Pour Goldenson (1970), c'est la dynamique du comportement et de son maintien.", keywords:["déclenchement","orientation","intensité","persistance","comportement","Goldenson"], exp:"3 types : fondamentales, stimulation, acquises secondaires." },
  { id:313, c:3, type:"def", q:"Expliquez la pyramide des besoins de MASLOW.", answer:"Maslow organise les besoins humains en pyramide hiérarchique. Base : besoins physiologiques. Niveau 2 : sécurité. Niveau 3 : besoins sociaux/appartenance. Niveau 4 : estime personnelle. Sommet : réalisation de soi. Les besoins inférieurs doivent être satisfaits avant d'accéder aux supérieurs.", keywords:["pyramide","hiérarchique","physiologiques","sécurité","sociaux","estime","réalisation"], exp:"Maslow : les besoins d'estime et de réalisation de soi sont rarement atteints." },
  { id:314, c:3, type:"qcm", q:"Qui a mis en évidence les besoins de stimulation en 1954 avec des expériences sur des singes ?", opts:["Maslow","Mac Clelland","Butler","Freud"], ans:2, exp:"Butler et ses collaborateurs ont mené 2 expériences en 1954 montrant que les singes répondaient à un besoin de découvrir et saisir l'environnement." },
  { id:315, c:3, type:"qcm", q:"Selon Claude Bernard, l'état d'équilibre (homéostasie) est :", opts:["Un phénomène uniquement physique","Une condition nécessaire à la survie de l'individu","Un état jamais atteint naturellement","Un besoin acquis secondaire"], ans:1, exp:"Claude Bernard : l'état d'équilibre est une condition nécessaire à la survie de l'individu." },
  { id:316, c:3, type:"qcm", q:"Selon Freud, d'où naissent les pulsions ?", opts:["Des interactions sociales","D'un état de tension pénible qui nécessite d'être réduit","Des besoins physiologiques comme la faim et la soif","Des récompenses externes"], ans:1, exp:"Freud : les pulsions naissent d'un état de tension pénible. Quand le sujet réduit cette tension, il ressent du plaisir." },
  { id:317, c:3, type:"qcm", q:"Selon Atkinson (1964), combien de variables interviennent dans une situation d'accomplissement ?", opts:["1","2","3","4"], ans:1, exp:"Atkinson : 2 variables — la motivation dirigée vers un but d'accomplissement (interne au sujet) ET la situation (externe)." },
  { id:318, c:3, type:"qcm", q:"L'effet stimulant de la présence d'autrui sur les performances a été mis en évidence par :", opts:["Maslow","Atkinson","Triplett","Deci"], ans:2, exp:"Triplett : la simple présence d'autrui peut amener le sujet à améliorer ses performances (effet de facilitation sociale)." },
  { id:319, c:3, type:"qcm", q:"Roudite (1963) distingue 2 types de motivation sportive. La motivation DIRECTE correspond à :", opts:["Se préparer à une vie professionnelle","La maîtrise des difficultés, les satisfactions esthétiques du geste et le plaisir de la compétition","Un but politique et idéologique","La recherche d'une meilleure santé"], ans:1, exp:"Motivation directe (Roudite) : désir de maîtrise des difficultés, satisfactions esthétiques du geste sportif, plaisir de la compétition." },
  { id:320, c:3, type:"qcm", q:"Les motivations acquises secondaires se rattachent à des besoins appris relatifs à :", opts:["La faim, la soif, la douleur","La puissance, l'appartenance, le prestige, la sécurité, l'accomplissement","La curiosité et l'exploration","La survie biologique uniquement"], ans:1, exp:"Motivations acquises secondaires : puissance, appartenance, prestige, sécurité, accomplissement. Acquises par contacts socio-affectifs et état sociologique." },
  { id:321, c:3, type:"vf", q:"Les besoins de stimulation sont innés mais ne sont en aucun cas liés à la survie.", ans:true, exp:"Vrai. Les besoins de stimulation (curiosité, exploration) sont innés mais servent à stimuler le SNC et recueillir des informations, pas à survivre." },
  { id:322, c:3, type:"vf", q:"Dans la pyramide de Maslow, les besoins sociaux (appartenance) précèdent les besoins de sécurité.", ans:false, exp:"Faux. L'ordre correct de Maslow : 1. Physiologiques → 2. Sécurité → 3. Sociaux/Appartenance → 4. Estime → 5. Réalisation de soi." },
  { id:323, c:3, type:"vf", q:"La motivation intrinsèque selon Deci est diminuée par tout ce qui est perçu comme un contrôle externe.", ans:true, exp:"Vrai. Deci : la motivation intrinsèque est diminuée par ce qui est perçu comme contrôle : contrainte, récompenses monétaires, surveillance." },
  { id:324, c:3, type:"def", q:"Définissez les BESOINS DE STIMULATION selon Butler et leur lien avec la motivation.", answer:"Les besoins de stimulation ont été mis en évidence par Butler (1954) à travers 2 expériences sur des singes. Ce sont des besoins innés non liés à la survie. Ils servent à stimuler le système nerveux et à recueillir des informations sur l'environnement. Ils correspondent à des besoins de curiosité, d'exploration et de découverte.", keywords:["Butler","1954","innés","stimuler","système nerveux","curiosité","exploration","singes"], exp:"Butler : les singes ouvraient une fenêtre uniquement pour explorer, sans récompense alimentaire." },

  // ===== CH.4 PERCEPTION =====
  { id:400, c:4, type:"qcm", q:"La perception est définie dans le cours comme :", opts:["La réception brute des stimuli par les organes des sens","L'ensemble des mécanismes par lesquels l'organisme prend connaissance du monde","La mémorisation des expériences sensorielles","La réaction motrice à un stimulus"], ans:1, exp:"Perception = ensemble des mécanismes par lesquels l'organisme prend connaissance du monde." },
  { id:401, c:4, type:"qcm", q:"L'approche Bottom-up (directe) en perception signifie que :", opts:["Les connaissances s'imposent à l'environnement","L'environnement s'impose aux connaissances","La perception dépend entièrement de la mémoire","La perception est un processus purement biologique"], ans:1, exp:"Bottom-up (Gibson, Gestalt) : l'environnement s'impose aux connaissances." },
  { id:402, c:4, type:"qcm", q:"La PROPRIOCEPTION est :", opts:["La vision en 3D","Le sens de l'équilibre","Le sens qui renseigne sur la position du corps dans l'espace","La capacité à percevoir les sons graves"], ans:2, exp:"Proprioception = 6e sens qui renseigne sur la position et les mouvements du corps dans l'espace." },
  { id:403, c:4, type:"qcm", q:"Combien d'étapes comporte le traitement de l'information dans la perception ?", opts:["2","3","4","5"], ans:2, exp:"4 étapes : Monde physique → Énergie/Stimulus → Récepteur sensoriel → SNC/Percept." },
  { id:404, c:4, type:"qcm", q:"Quelle est la différence entre SENSATION et PERCEPTION ?", opts:["Ce sont des synonymes","Sensation = physiologique (détection), Perception = psychologique (interprétation)","Sensation = psychologique, Perception = physiologique","Sensation est plus précise que la perception"], ans:1, exp:"Sensation = détection physiologique. Perception = interprétation psychologique." },
  { id:405, c:4, type:"qcm", q:"L'image rétinienne brute est :", opts:["Tridimensionnelle, droite, complète","Inversée, bidimensionnelle, zone de netteté réduite à 2°","Identique à ce que perçoit le cerveau","Parfaitement fidèle à la réalité"], ans:1, exp:"L'image rétinienne est inversée, bidimensionnelle, et la zone de netteté est réduite à 2 degrés." },
  { id:406, c:4, type:"qcm", q:"L'approche Top-down (indirecte) est associée à :", opts:["Gibson","Gestalt","Bruner","Wundt"], ans:2, exp:"Top-down (Bruner) : les connaissances s'imposent à l'environnement." },
  { id:407, c:4, type:"qcm", q:"Combien de sens avons-nous (en incluant la proprioception) ?", opts:["4","5","6","7"], ans:2, exp:"6 sens : goût, odorat, audition, toucher, vue + proprioception." },
  { id:408, c:4, type:"vf", q:"La perception est une copie exacte et fidèle de la réalité.", ans:false, exp:"Faux. La perception est une CONSTRUCTION active du cerveau, influencée par l'attention, l'expérience, les émotions." },
  { id:409, c:4, type:"vf", q:"Notre système perceptif peut percevoir tous les types de stimuli existants.", ans:false, exp:"Faux. Le système perceptif est limité : on ne perçoit pas les ultrasons, certaines odeurs, les infrarouges." },
  { id:410, c:4, type:"vf", q:"L'approche Top-down signifie que nos connaissances influencent notre perception.", ans:true, exp:"Vrai. Top-down (Bruner) : les connaissances s'imposent à l'environnement." },
  { id:411, c:4, type:"vf", q:"La proprioception est l'un des 5 sens traditionnels.", ans:false, exp:"Faux. Les 5 sens traditionnels sont : goût, odorat, audition, toucher, vue. La proprioception est un 6e sens." },
  { id:412, c:4, type:"def", q:"Définissez la PERCEPTION selon le cours.", answer:"La perception se définit comme l'ensemble des mécanismes par lesquels l'organisme prend connaissance du monde. Le système perceptif transforme des stimulations en informations. C'est le traitement de l'information et la représentation du monde physique.", keywords:["mécanismes","stimulations","traitement","représentation"], exp:"Sensation = physiologique. Perception = psychologique." },
  { id:413, c:4, type:"def", q:"Expliquez les approches BOTTOM-UP et TOP-DOWN de la perception.", answer:"Bottom-up (approche directe, Gibson, Gestalt) : l'environnement s'impose aux connaissances. Top-down (approche indirecte, Bruner) : les connaissances préalables s'imposent à l'environnement. L'expérience, la mémoire et les attentes influencent la perception.", keywords:["bottom-up","environnement","top-down","connaissances","Gibson","Bruner"], exp:"Première fois = bottom-up. Si on le connaît déjà = top-down." },
  { id:414, c:4, type:"qcm", q:"Combien de formes d'énergie sont distinguées dans le traitement de l'information perceptif ?", opts:["2 (lumineuse et chimique)","3 (lumineuse, cinétique, chimique)","4 (lumineuse, sonore, chimique, thermique)","1 (électromagnétique uniquement)"], ans:1, exp:"3 formes d'énergie : lumineuse (lumière, chaleur) = stimuli électromagnétiques ; cinétique (acoustique) = stimuli mécaniques ; chimique (goût) = stimuli solides/liquides." },
  { id:415, c:4, type:"qcm", q:"Pourquoi dit-on qu'il y a 'reconstitution' dans le percept visuel ?", opts:["Parce que la vision est parfaite et complète","Parce que l'image rétinienne est incomplète et le cerveau la complète (couleur, forme, 3D)","Parce que la rétine stocke les images","Parce que la perception dépend uniquement de la mémoire"], ans:1, exp:"L'image rétinienne est inversée, bidimensionnelle, sans couleur ni forme précises. Le cerveau la complète → reconstitution." },
  { id:416, c:4, type:"qcm", q:"Dans l'approche constructiviste de la perception, comment les cognitivistes fonctionnent-ils ?", opts:["Ils ne tiennent compte que du stimulus brut","Ils font des inférences inconscientes pour assimiler l'information de différentes sources","Ils rejettent toute connaissance antérieure","Ils ne considèrent que la mémoire sémantique"], ans:1, exp:"Approche constructiviste : les cognitivistes réalisent des inférences inconscientes pour assimiler l'information venant de différentes sources." },
  { id:417, c:4, type:"qcm", q:"Selon Gibson, pourquoi n'a-t-on pas besoin d'inférences pour reconnaître un panneau STOP ?", opts:["Parce que nous l'avons mémorisé","Parce que le contexte naturel contient suffisamment d'information (couleur, forme, emplacement)","Parce que la rétine le reconnaît directement","Parce que le cerveau le devine toujours"], ans:1, exp:"Gibson (approche écologique) : le contexte naturel contient suffisamment d'information pour effectuer des jugements perceptifs sans inférences supplémentaires." },
  { id:418, c:4, type:"qcm", q:"Quelle est la tendance actuelle concernant les approches Bottom-up et Top-down ?", opts:["On privilégie uniquement le Bottom-up","On privilégie uniquement le Top-down","On synthétise les deux approches comme complémentaires","On les considère comme contradictoires et incompatibles"], ans:2, exp:"De nos jours, on tend à synthétiser ces deux approches (directe et indirecte) comme complémentaires." },
  { id:419, c:4, type:"vf", q:"La perception dépend uniquement des organes des sens et non de facteurs psychologiques.", ans:false, exp:"Faux. Le cerveau dispose d'autres sources qui affectent la perception : motivations, besoins, état émotionnel, personnalité, opinions." },
  { id:420, c:4, type:"vf", q:"Le système perceptif humain se caractérise par sa fiabilité, son adaptabilité et sa flexibilité.", ans:true, exp:"Vrai. En plus de sa complexité, le système perceptif humain est fiable, adaptable et flexible." },
  { id:421, c:4, type:"def", q:"Expliquez le TRAITEMENT DE L'INFORMATION dans la perception selon ses 4 étapes.", answer:"Le traitement perceptif comporte 4 étapes : 1) Monde physique/Objet physique → 2) Énergie/Stimulus → 3) Récepteur sensoriel (influx nerveux = SENSATION, domaine de la physiologie) → 4) SNC/Percept (PERCEPTION, domaine de la psychologie). L'énergie de l'objet excite les récepteurs, produit un influx nerveux qui atteint le SNC et est transformé en percept.", keywords:["monde physique","énergie","stimulus","récepteur sensoriel","influx nerveux","SNC","percept","sensation","perception"], exp:"Sensation = domaine de la physiologie. Perception = domaine de la psychologie." },

  // ===== CH.5 APPRENTISSAGE =====
  { id:500, c:5, type:"qcm", q:"Selon Reuchlin (1977), il y a apprentissage quand :", opts:["L'individu mémorise une information","Un individu placé plusieurs fois dans la même situation modifie sa conduite de façon systématique et durable","Le sujet reproduit exactement un comportement observé","L'individu reçoit une récompense"], ans:1, exp:"Reuchlin (1977) : apprentissage = modification systématique et DURABLE de la conduite." },
  { id:501, c:5, type:"qcm", q:"Combien de théories d'apprentissage sont abordées dans le cours ?", opts:["2","3","4","5"], ans:2, exp:"4 théories : comportementale (béhaviorisme), constructiviste (Piaget), socio-constructiviste (Vygotsky), socio-cognitive (Bandura)." },
  { id:502, c:5, type:"qcm", q:"Watson crée le béhaviorisme en quelle année ?", opts:["1879","1900","1913","1945"], ans:2, exp:"Watson crée le béhaviorisme en 1913 à partir du mot behaviour (comportement)." },
  { id:503, c:5, type:"qcm", q:"Pavlov a découvert le conditionnement classique en étudiant :", opts:["Des rats dans un labyrinthe","La digestion des chiens","Des singes en cage","Des enfants en bas âge"], ans:1, exp:"Pavlov utilisait des chiens pour des études sur la digestion. Prix Nobel." },
  { id:504, c:5, type:"qcm", q:"Dans le conditionnement classique, qu'est-ce que le Stimulus Conditionnel (SC) ?", opts:["La nourriture (provoque la salivation naturellement)","Le son de cloche avant le conditionnement (neutre)","Le son de cloche APRÈS le conditionnement, qui provoque seul la salivation","La salivation provoquée par le son seul"], ans:2, exp:"SC = stimulus initialement neutre qui, après association répétée avec le SI, provoque seul la réaction conditionnelle." },
  { id:505, c:5, type:"qcm", q:"Qu'est-ce que l'EXTINCTION dans le conditionnement ?", opts:["L'augmentation progressive de la réponse","La disparition de la réponse conditionnelle suite à l'absence du SI","Le renforcement d'un comportement","La généralisation à d'autres stimuli similaires"], ans:1, exp:"Extinction = disparition de la RC suite à l'absence répétée du SI." },
  { id:506, c:5, type:"qcm", q:"Qui a développé le conditionnement opérant ?", opts:["Pavlov","Watson","Skinner (1904-1988)","Thorndike"], ans:2, exp:"BF Skinner (1904-1988) développe le conditionnement opérant." },
  { id:507, c:5, type:"qcm", q:"La ZPD de Vygotsky est la distance entre :", opts:["Le niveau actuel (seul) et le niveau potentiel (avec aide)","Le niveau scolaire et le niveau réel","L'âge mental et l'âge chronologique","Ce que l'enfant sait et ce qu'il ne sait pas"], ans:0, exp:"ZPD = distance entre ce que l'enfant peut faire seul (développement actuel) et avec aide (niveau potentiel)." },
  { id:508, c:5, type:"qcm", q:"Qui est l'auteur de la théorie de l'apprentissage social (vicariant) ?", opts:["Piaget","Vygotsky","Bandura (1971)","Bruner"], ans:2, exp:"Albert Bandura (1971) : théorie de l'apprentissage vicariant. Apprendre par observation d'autrui." },
  { id:509, c:5, type:"qcm", q:"Combien de processus comporte l'apprentissage vicariant de Bandura ?", opts:["2","3","4","5"], ans:2, exp:"4 processus : 1) Attentionnel, 2) Rétention, 3) Reproduction motrice, 4) Motivationnel." },
  { id:510, c:5, type:"qcm", q:"Combien de lois partagent le conditionnement classique et opérant ?", opts:["3","5","7","10"], ans:2, exp:"7 lois communes : répétition, contiguïté temporelle, extinction, récupération spontanée, généralisation, discrimination, inhibition." },
  { id:511, c:5, type:"qcm", q:"Le renforcement NÉGATIF consiste à :", opts:["Punir un comportement indésirable","Retirer un stimulus désagréable pour augmenter la fréquence d'un comportement","Présenter un stimulus désagréable","Ignorer un comportement"], ans:1, exp:"Renforcement négatif = retirer un stimulus DÉSAGRÉABLE pour augmenter la fréquence du comportement." },
  { id:512, c:5, type:"vf", q:"Selon Piaget, le rééquilibrage (après déséquilibre) constitue le véritable apprentissage.", ans:true, exp:"Vrai. Piaget : déséquilibre → rééquilibrage = construction d'une nouvelle structure cognitive." },
  { id:513, c:5, type:"vf", q:"Pour Vygotsky, la vraie direction du développement va de l'individuel au social.", ans:false, exp:"Faux. Vygotsky : la vraie direction du développement va du SOCIAL à l'INDIVIDUEL." },
  { id:514, c:5, type:"vf", q:"Selon Bandura, l'être humain n'apprend que par essai-erreur direct.", ans:false, exp:"Faux. Bandura montre que l'être humain apprend aussi par OBSERVATION d'autrui (apprentissage vicariant)." },
  { id:515, c:5, type:"vf", q:"Dans le conditionnement classique, l'optimum de contiguïté temporelle est une demi-seconde d'avance du SC.", ans:true, exp:"Vrai. L'optimum est une demi-seconde d'avance du SC sur le SI." },
  { id:516, c:5, type:"vf", q:"Vygotsky pense que c'est la croissance cognitive qui précède et permet l'apprentissage.", ans:false, exp:"Faux. C'est la position de PIAGET. Pour Vygotsky, c'est l'APPRENTISSAGE qui tire le développement." },
  { id:517, c:5, type:"def", q:"Définissez l'APPRENTISSAGE selon le cours.", answer:"L'apprentissage désigne la modification systématique des connaissances, du comportement et des capacités en fonction de l'entraînement. Selon Reuchlin (1977) : modification systématique et durable de la conduite dans une même situation.", keywords:["modification systématique","comportement","connaissances","capacités","durable"], exp:"Doré et Mercier (1992) : acquérir des connaissances sur le monde et les modifier." },
  { id:518, c:5, type:"def", q:"Définissez la ZPD de Vygotsky et son importance pédagogique.", answer:"La Zone Proximale de Développement (ZPD) est la distance entre deux niveaux : le niveau de développement actuel (ce que l'enfant peut faire seul) et le niveau de développement potentiel (ce qu'il peut faire avec l'aide d'un adulte ou d'un pair). C'est dans la ZPD que l'enseignant doit intervenir.", keywords:["distance","développement actuel","seul","potentiel","aide","adulte","ZPD"], exp:"Vygotsky : ce que l'enfant sait faire aujourd'hui en collaboration, il saura le faire tout seul demain." },
  { id:519, c:5, type:"def", q:"Expliquez l'ÉTAYAGE de Bruner et ses 6 fonctions du tuteur.", answer:"L'étayage (Bruner, 1983) est le soutien apporté par le tuteur à l'apprenant pour lui permettre de résoudre un problème au-delà de ses capacités actuelles. 6 fonctions : Enrôler, Réduire le degré de liberté, Maintenir l'orientation, Signaler les caractéristiques déterminantes, Contrôler la frustration, Démontrer.", keywords:["étayage","Bruner","tuteur","enrôler","réduire","maintenir","signaler","contrôler","démontrer"], exp:"2 aspects : socio-affectif (enrôlement) et cognitif (alléger la tâche)." },
  { id:520, c:5, type:"qcm", q:"Selon George (1991), l'apprentissage est :", opts:["La modification du comportement uniquement","Une modification de la capacité à réaliser une tâche sous l'effet des interactions avec l'environnement","La mémorisation d'informations","L'association d'un stimulus à une réponse"], ans:1, exp:"George (1991) : l'apprentissage est une modification de la capacité de l'individu à réaliser une tâche sous l'effet des interactions avec son environnement." },
  { id:521, c:5, type:"qcm", q:"Qu'est-ce que le dispositif S-R dans le béhaviorisme ?", opts:["Sujet-Récompense","Stimulus-Réponse : le stimulus (externe) produit une réponse (interne) traduite en comportement observable","Savoir-Raisonner","Stimulus-Renforcement"], ans:1, exp:"S-R = Stimulus-Réponse. Le stimulus est externe ; il produit une réponse interne traduite physiquement par un comportement observable." },
  { id:522, c:5, type:"qcm", q:"Pourquoi appelle-t-on le conditionnement de Skinner 'opérant' ou 'instrumental' ?", opts:["Parce qu'il opère sur le système nerveux","Parce que ce sont les CONSÉQUENCES du comportement qui opèrent sur la probabilité de ce comportement","Parce qu'il utilise des instruments de laboratoire","Parce qu'il opère sur le stimulus"], ans:1, exp:"'Opérant/Instrumental' : ce sont les conséquences du comportement qui opèrent sur sa probabilité d'apparition. Le comportement est un instrument." },
  { id:523, c:5, type:"qcm", q:"Dans l'expérience de la boîte de Skinner, que fait le rat affamé au départ ?", opts:["Il appuie immédiatement sur le levier car il le reconnaît","Il explore son environnement et actionne par HASARD le levier qui provoque de la nourriture","Il suit un stimulus conditionnel","Il imite un autre rat"], ans:1, exp:"Le rat affamé explore et actionne PAR HASARD le levier. Il constate que cela provoque la nourriture. Il appuie de plus en plus fréquemment → conditionnement." },
  { id:524, c:5, type:"qcm", q:"Selon Piaget, pour apprendre il faut d'abord :", opts:["Être récompensé par une note","Observer un modèle expert","RÉUSSIR POUR APPRENDRE (l'apprentissage nécessite de partir du connu)","Être mis en déséquilibre cognitif"], ans:2, exp:"Piaget : il faut RÉUSSIR POUR APPRENDRE. L'apprentissage n'est possible qu'à partir de liens avec le connu, le déjà-appris (assimilation)." },
  { id:525, c:5, type:"qcm", q:"Qu'est-ce qu'un 'objectif pédagogique' selon l'approche béhavioriste ?", opts:["Un contenu à transmettre à l'élève","Une réponse interne traduite en comportement observable face à une stimulation d'enseignement","Un renforcement positif","Une étape de la ZPD de Vygotsky"], ans:1, exp:"Objectif pédagogique (béhaviorisme) : réponse interne traduite concrètement en comportement OBSERVABLE. Expression des résultats attendus en comportement après une intervention pédagogique." },
  { id:526, c:5, type:"qcm", q:"Selon Doré et Mercier (1992), apprendre consiste à :", opts:["Mémoriser des informations de façon mécanique","Acquérir des connaissances sur le monde ET les modifier","Répéter des comportements renforcés","Observer des modèles et les imiter"], ans:1, exp:"Doré et Mercier (1992) : apprendre = acquérir des connaissances sur le monde ET les modifier." },
  { id:527, c:5, type:"qcm", q:"Quelle est la principale différence entre conditionnement classique et opérant ?", opts:["Ils sont identiques","Classique : stimulus déclenche la réponse (S-R) ; Opérant : les conséquences du comportement contrôlent sa fréquence","Classique = Skinner ; Opérant = Pavlov","Le classique ne s'applique qu'aux animaux"], ans:1, exp:"Classique (Pavlov) = type S-R, le stimulus déclenche la réponse. Opérant (Skinner) = ce sont les conséquences (renforcement/punition) qui contrôlent la fréquence du comportement." },
  { id:528, c:5, type:"vf", q:"Dans le béhaviorisme, l'apprentissage est défini comme une association entre un stimulus et une réponse comportementale.", ans:true, exp:"Vrai. Le béhaviorisme définit l'apprentissage comme une association S-R (Stimulus-Réponse comportementale)." },
  { id:529, c:5, type:"vf", q:"Selon Piaget, laisser un apprenant en déséquilibre nuit à son développement.", ans:true, exp:"Vrai. Piaget : laisser un apprenant en déséquilibre (ou l'accentuer) nuit à son développement. Il faut faire vivre des réussites et des rééquilibrages." },
  { id:530, c:5, type:"vf", q:"La loi de discrimination/différentiation consiste à répondre de la même façon à deux stimuli similaires.", ans:false, exp:"Faux. La discrimination = répondre DIFFÉREMMENT à deux stimuli proches. C'est le processus INVERSE de la généralisation." },
  { id:531, c:5, type:"vf", q:"La récupération spontanée signifie que l'extinction efface définitivement le conditionnement.", ans:false, exp:"Faux. La récupération spontanée prouve que l'extinction n'est PAS un effacement : après un temps de repos, le stimulus conditionnel est à nouveau efficace." },
  { id:532, c:5, type:"def", q:"Expliquez le CONDITIONNEMENT CLASSIQUE de Pavlov avec son schéma.", answer:"Le conditionnement classique (Pavlov) est un apprentissage par association. Schéma : SI→RI (nourriture→salivation, inné). SN+SI→RI (son+nourriture→salivation, apprentissage). SC→RC (son seul→salivation, conditionné). Le stimulus initialement neutre (SN) devient stimulus conditionnel (SC) après association répétée avec le stimulus inconditionnel (SI).", keywords:["Pavlov","stimulus inconditionnel","stimulus conditionnel","réaction conditionnelle","association","neutre","chiens","salivation"], exp:"Pavlov a découvert le conditionnement en étudiant la digestion des chiens. Prix Nobel." },
  { id:533, c:5, type:"def", q:"Expliquez les 3 principes de base de la CONCEPTION COGNITIVE de l'apprentissage.", answer:"La psychologie cognitive se fonde sur 3 principes : 1) L'apprentissage est un processus actif et constructif — l'apprenant fait une sélection des informations et crée des règles. 2) L'apprentissage est l'établissement de liens entre nouvelles informations et connaissances antérieures. 3) L'apprentissage requiert l'organisation constante des connaissances pour faciliter leur intégration en mémoire à long terme.", keywords:["actif","constructif","sélection","liens","connaissances antérieures","organisation","mémoire long terme","Piaget"], exp:"Piaget est le précurseur de la psychologie cognitive, le premier à ouvrir la 'boîte noire'." },

  // ===== CH.6 DÉVELOPPEMENT =====
  { id:600, c:6, type:"qcm", q:"Qui a créé le premier laboratoire de psychologie de l'enfant en 1883 ?", opts:["Wundt","Piaget","Hall","Darwin"], ans:2, exp:"Hall a créé le premier laboratoire de psychologie de l'enfant en 1883. Il a créé la paidologie." },
  { id:601, c:6, type:"qcm", q:"La théorie de la Sélection Naturelle de Darwin stipule que :", opts:["Tous les individus d'une espèce survivent","Seuls les individus capables de s'adapter survivent","L'évolution se fait par sauts brutaux","L'homme et l'animal sont totalement différents"], ans:1, exp:"Darwin : Sélection Naturelle = seuls les individus capables de s'adapter survivent." },
  { id:602, c:6, type:"qcm", q:"La CROISSANCE se distingue de la MATURATION car :", opts:["La croissance est inférée du comportement","La croissance = modifications physiques observables, la maturation = processus internes inférés","Elles sont synonymes","La croissance concerne le cerveau, la maturation le corps"], ans:1, exp:"Croissance = modifications physiques OBSERVABLES. Maturation = processus INTERNES inférés." },
  { id:603, c:6, type:"qcm", q:"L'Ontogenèse étudie :", opts:["Le développement d'une espèce","Le développement de l'individu de sa conception à sa mort","Le développement dans une situation particulière","L'évolution de l'espèce humaine"], ans:1, exp:"Ontogenèse = développement de l'individu. Phylogenèse = espèce. Microgenèse = situation particulière." },
  { id:604, c:6, type:"qcm", q:"Le développement Céphalo-Caudal signifie que :", opts:["Le développement va du proche vers l'éloigné du SNC","Le développement va de la tête aux pieds","Le développement est continu et régulier","Le développement va du simple au complexe"], ans:1, exp:"Céphalo-Caudal = de la tête aux pieds (tenir la tête → assis → debout → marche)." },
  { id:605, c:6, type:"qcm", q:"Quelle est la limite principale de l'approche longitudinale ?", opts:["Elle ne peut pas décrire le développement individuel","La mortalité expérimentale et l'effet d'entraînement","Elle confond les différences d'âge avec les effets de génération","Elle est trop rapide pour être fiable"], ans:1, exp:"Inconvénients : coût en temps, mortalité expérimentale, effet d'entraînement." },
  { id:606, c:6, type:"qcm", q:"L'effet de cohorte est un problème lié à quelle méthode ?", opts:["Longitudinale","Transversale","Mixte/séquentielle","Expérimentale"], ans:1, exp:"Approche transversale : limite = effet de cohorte (personnes d'âges différents ont vécu des conditions différentes)." },
  { id:607, c:6, type:"qcm", q:"Selon les maturationnistes, quel facteur est seul responsable du développement ?", opts:["L'environnement social","Le patrimoine génétique","L'éducation","L'alimentation"], ans:1, exp:"Maturationnistes : le patrimoine génétique est seul responsable du développement. Notion de période critique." },
  { id:608, c:6, type:"qcm", q:"Selon les empiristes, l'esprit de l'enfant à la naissance est :", opts:["Déjà structuré génétiquement","Une table rase (rien n'est prédéterminé)","En partie inné, en partie acquis","Dominé par les instincts"], ans:1, exp:"Empiristes : esprit = table rase à la naissance. Tout est appris par facteurs sociaux/externes." },
  { id:609, c:6, type:"qcm", q:"L'empreinte de Lorentz : le bébé oiseau suit le premier objet mobile perçu pendant :", opts:["Les premiers 7 jours","Les premières 24 heures après l'éclosion","Les premières 3 semaines","Le premier mois"], ans:1, exp:"Lorentz : le bébé oiseau suit le premier objet mobile perçu dans les 24h après l'éclosion." },
  { id:610, c:6, type:"qcm", q:"L'approche transversale consiste à :", opts:["Suivre les mêmes individus dans le temps","Étudier au même moment plusieurs groupes d'âges différents","Combiner les deux approches","Observer des individus dans leur milieu naturel"], ans:1, exp:"Transversale : au même moment, plusieurs groupes d'âges différents. Rapide mais effet de cohorte." },
  { id:611, c:6, type:"vf", q:"Le développement physique suit un ordre Céphalo-Caudal (de la tête aux pieds).", ans:true, exp:"Vrai. 2 axes : Céphalo-Caudal (tête vers pieds) et Proximo-Distal (proche vers éloigné du SNC)." },
  { id:612, c:6, type:"vf", q:"Le débat inné/acquis est aujourd'hui considéré comme dépassé.", ans:true, exp:"Vrai. Le développement est aujourd'hui le résultat de l'INTERACTION entre facteurs biologiques ET sociaux." },
  { id:613, c:6, type:"vf", q:"Durant le vieillissement, il n'y a que des pertes, pas de gains.", ans:false, exp:"Faux. Le développement est multidirectionnel. Vieillissement : pertes (neurones) MAIS AUSSI gains (sagesse)." },
  { id:614, c:6, type:"vf", q:"L'observation non participante est plus fidèle car elle n'influence pas le comportement observé.", ans:true, exp:"Vrai. Non participante (observateur non vu) : ne perturbe pas le comportement, plus fidèle à la réalité." },
  { id:615, c:6, type:"vf", q:"Selon les maturationnistes, l'environnement social joue un rôle fondamental dans le développement.", ans:false, exp:"Faux. Les maturationnistes estiment que le patrimoine génétique est LE SEUL facteur responsable." },
  { id:616, c:6, type:"def", q:"Définissez la PSYCHOLOGIE DU DÉVELOPPEMENT.", answer:"La psychologie du développement étudie les changements développementaux et les différents facteurs qui interviennent sur ces changements, de la conception à la mort. Elle étudie la croissance (modifications physiques observables) et la maturation (processus internes inférés).", keywords:["changements développementaux","conception","mort","croissance","maturation"], exp:"3 niveaux : Ontogenèse (individu), Phylogenèse (espèce), Microgenèse (situation particulière)." },
  { id:617, c:6, type:"def", q:"Distinguez l'approche LONGITUDINALE et l'approche TRANSVERSALE.", answer:"Longitudinale : suivre les mêmes individus dans le temps. Précise, mais coûteuse et avec mortalité expérimentale. Transversale : étudier au même moment plusieurs groupes d'âges différents. Rapide, économique, mais soumise à l'effet de cohorte. Les deux approches sont complémentaires.", keywords:["longitudinale","mêmes individus","transversale","groupes d'âges","cohorte","complémentaires"], exp:"Approche mixte = combine les deux." },
  { id:618, c:6, type:"qcm", q:"Que fait exactement la psychologie du développement ?", opts:["Elle étudie uniquement les enfants de 0 à 18 ans","Elle étudie les changements développementaux et leurs facteurs, de la conception à la mort","Elle étudie uniquement les comportements observables","Elle étudie le développement des espèces animales"], ans:1, exp:"La psychologie du développement étudie les changements développementaux et les différents facteurs qui interviennent sur ces changements, de la conception à la mort." },
  { id:619, c:6, type:"qcm", q:"Quelle est la différence entre changements quantitatifs et qualitatifs ?", opts:["Les deux sont identiques","Quantitatifs = mesurables (taille, poids) ; Qualitatifs = changements complexes (stades cognitifs)","Quantitatifs = cognitifs ; Qualitatifs = physiques","Quantitatifs = difficiles à mesurer ; Qualitatifs = faciles"], ans:1, exp:"Changements quantitatifs = taille, poids (mesurables). Changements qualitatifs = plus complexes (étapes du développement de l'intelligence)." },
  { id:620, c:6, type:"qcm", q:"Quel est l'avantage principal de l'approche longitudinale ?", opts:["Elle est rapide et économique","Elle permet une description précise du développement d'un individu, seules les différences intra-individuelles sont observées","Elle évite l'effet de cohorte","Elle peut étudier plusieurs groupes en même temps"], ans:1, exp:"Longitudinale : description précise du développement individuel. Les différences observées ne peuvent être attribuées qu'au processus développemental." },
  { id:621, c:6, type:"qcm", q:"Qu'est-ce que l'approche transversale séquentielle (approche mixte) ?", opts:["Uniquement l'approche longitudinale","Uniquement l'approche transversale","Une combinaison des deux : plusieurs mesures dans le temps sur des groupes d'âges différents","Une observation non structurée"], ans:2, exp:"L'approche mixte (séquentielle) combine longitudinale ET transversale : plusieurs mesures étalées dans le temps sur des groupes d'âges différents." },
  { id:622, c:6, type:"qcm", q:"Quel est l'inconvénient de l'observation non structurée ?", opts:["Elle ne peut pas observer le comportement individuel","Elle présente un risque d'interprétations erronées et non scientifiques","Elle nécessite un schéma d'observation complexe","Elle influence toujours le comportement observé"], ans:1, exp:"Observation non structurée : avantage = vue d'ensemble. Inconvénient = risque d'interprétations erronées et non scientifiques." },
  { id:623, c:6, type:"qcm", q:"La notion de 'Période Critique' est liée à quelle théorie du développement ?", opts:["Les théories empiristes","Les théories maturationnistes (innéistes)","Le constructivisme de Piaget","Le socio-constructivisme de Vygotsky"], ans:1, exp:"Les maturationnistes : notion de Période Critique = si un enfant n'apprend pas au moment prévu, le développement devient impossible une fois la période révolue." },
  { id:624, c:6, type:"qcm", q:"Qu'est-ce que le développement Proximo-Distal ?", opts:["Du simple au complexe cognitif","Du proche vers l'éloigné du SNC (épaule → coude → poignet)","De la tête aux pieds","Du cognitif vers le physique"], ans:1, exp:"Proximo-Distal = du PROCHE (épaule) vers l'ÉLOIGNÉ du SNC (coude, poignet). Complémentaire au développement céphalo-caudal." },
  { id:625, c:6, type:"qcm", q:"Selon la conception actuelle du développement, que se passe-t-il durant le vieillissement ?", opts:["Uniquement des pertes (perte de neurones)","Uniquement des gains (sagesse)","À la fois des pertes (neurones) ET des gains (nouveaux mots, sagesse, nouvelles capacités)","Aucun changement développemental"], ans:2, exp:"Le développement est multidirectionnel : vieillissement = pertes (neurones) MAIS AUSSI gains (nouveaux mots, sagesse, nouvelles capacités)." },
  { id:626, c:6, type:"vf", q:"L'approche longitudinale observe des individus différents à un même moment.", ans:false, exp:"Faux. L'approche longitudinale suit les MÊMES individus dans le temps. C'est l'approche transversale qui compare différents groupes d'âges au même moment." },
  { id:627, c:6, type:"vf", q:"Selon les empiristes, l'esprit de l'enfant à la naissance est une table rase.", ans:true, exp:"Vrai. Les empiristes : rien n'est prédéterminé. L'esprit de l'enfant est une table rase à la naissance. Tout vient des facteurs sociaux/externes." },
  { id:628, c:6, type:"vf", q:"Le débat inné/acquis est aujourd'hui considéré comme dépassé.", ans:true, exp:"Vrai. Le développement est aujourd'hui le résultat de l'INTERACTION entre facteurs biologiques ET sociaux. Le débat est dépassé." },
  { id:629, c:6, type:"vf", q:"L'observation participante peut modifier le comportement de la personne observée.", ans:true, exp:"Vrai. Inconvénient de l'observation participante : en intervenant ou en étant visible, l'observateur peut modifier le comportement observé." },
  { id:630, c:6, type:"def", q:"Distinguez les théories MATURATIONNISTES et EMPIRISTES du développement.", answer:"Les maturationnistes (innéistes) considèrent que le patrimoine génétique est seul responsable du développement. Il n'y a pas d'influence extérieure ; le développement est fixé dès la conception. Ils introduisent la notion de période critique. Les empiristes pensent que l'esprit de l'enfant est une table rase à la naissance : tout est déterminé par les facteurs sociaux et externes. Aujourd'hui, ce débat est dépassé : le développement résulte de l'INTERACTION entre facteurs biologiques ET sociaux.", keywords:["maturationnistes","génétique","inné","empiristes","table rase","sociaux","interaction","période critique"], exp:"Exemple maturationniste : l'empreinte de Lorentz (bébé oiseau, 24h après l'éclosion)." },
  { id:631, c:6, type:"def", q:"Quels sont les 4 types d'observation en psychologie du développement ?", answer:"Les 4 types d'observation sont : 1) Participante : l'observateur fait partie du contexte — avantage = peut poser des questions ; inconvénient = peut modifier le comportement. 2) Non participante : l'observateur n'est pas vu — avantage = fidèle à la réalité ; inconvénient = ne peut pas intervenir. 3) Structurée (systématique) : règles définies à l'avance, schéma d'observation. 4) Non structurée : rapport narratif — avantage = vue d'ensemble ; inconvénient = risque d'interprétations erronées.", keywords:["participante","non participante","structurée","non structurée","schéma","comportement","fidèle","rapport narratif"], exp:"L'observation non participante est la plus fiable car elle ne perturbe pas le comportement observé." },

  // ===== QUESTIONS REFORMULÉES =====
  { id:1001, c:0, type:"qcm", tag:"reformulé", q:"Un entraîneur veut savoir si la musique améliore les performances. Il crée deux groupes : l'un avec musique, l'autre sans. Quelle est la Variable Indépendante (VI) ?", opts:["La performance mesurée","La présence ou absence de musique","Le groupe expérimental","La durée de l'entraînement"], ans:1, exp:"La VI est ce que l'expérimentateur MANIPULE = la musique. La VD = la performance mesurée." },
  { id:1002, c:1, type:"qcm", tag:"reformulé", q:"Un joueur de basket dribble sans y penser tout en cherchant ses coéquipiers. Quel type de mémoire permet ce geste automatique ?", opts:["Mémoire épisodique","Mémoire sémantique","Mémoire procédurale","Mémoire de travail"], ans:2, exp:"Le dribble automatique = mémoire procédurale (savoir-faire moteur). Pas de contrôle conscient nécessaire." },
  { id:1003, c:3, type:"qcm", tag:"reformulé", q:"Un sportif participe non pas pour la médaille, mais parce qu'il aime profondément son sport. Quelle forme de motivation illustre ce comportement ?", opts:["Motivation extrinsèque","Motivation homéostatique","Motivation intrinsèque","Motivation secondaire acquise"], ans:2, exp:"La motivation intrinsèque vient de l'intérieur : plaisir, passion, défi personnel." },
  { id:1004, c:5, type:"qcm", tag:"reformulé", q:"Un jeune nageur apprend la nage papillon en regardant des vidéos de champions olympiques. Cette forme d'apprentissage correspond à :", opts:["Conditionnement classique (Pavlov)","Conditionnement opérant (Skinner)","Apprentissage vicariant (Bandura)","Constructivisme (Piaget)"], ans:2, exp:"Apprendre par observation d'un modèle = apprentissage vicariant de Bandura." },
  { id:1005, c:2, type:"qcm", tag:"reformulé", q:"Un enfant de 4 ans pense que tout le monde voit la même chose que lui sur un dessin. Selon Piaget, il est au stade :", opts:["Sensori-moteur (0-2 ans)","Pré-opératoire (2-7 ans) — égocentrisme cognitif","Opérations concrètes (7-12 ans)","Opérations formelles (11+ ans)"], ans:1, exp:"Égocentrisme cognitif = stade pré-opératoire. L'enfant ne peut pas encore prendre le point de vue d'autrui." },
  { id:1006, c:4, type:"qcm", tag:"reformulé", q:"Un gardien de but expérimenté anticipe la direction du tir avant que le joueur frappe. Quelle approche perceptive illustre ce phénomène ?", opts:["Bottom-up (Gibson) : le stimulus s'impose","Top-down (Bruner) : les connaissances guident la perception","Proprioception : sens de l'équilibre","Mémoire sensorielle"], ans:1, exp:"Top-down = les connaissances préalables (expérience, mémoire) guident la perception. Le gardien anticipe grâce à ses schémas experts." },

  // ===== QUESTIONS SYNTHÈSE =====
  { id:2001, c:5, type:"qcm", tag:"synthèse", q:"Quelle est la différence FONDAMENTALE entre Piaget et Vygotsky sur la relation apprentissage/développement ?", opts:["Piaget pense que l'apprentissage tire le développement ; Vygotsky pense l'inverse","Vygotsky pense que le développement précède l'apprentissage ; Piaget pense l'inverse","Piaget : le développement précède l'apprentissage ; Vygotsky : l'apprentissage tire le développement","Ils partagent exactement la même vision"], ans:2, exp:"PIAGET : développement → apprentissage. VYGOTSKY : apprentissage → développement (via la ZPD).", keywords:["Piaget","développement précède","Vygotsky","apprentissage tire","ZPD"] },
  { id:2002, c:1, type:"qcm", tag:"synthèse", q:"Comparez mémoire déclarative et procédurale : laquelle est nécessaire pour retenir la règle du hors-jeu ?", opts:["Mémoire procédurale","Mémoire déclarative (sémantique)","Mémoire sensorielle","Mémoire de travail"], ans:1, exp:"La règle du hors-jeu = SAVOIR FACTUEL = mémoire déclarative sémantique. La procédurale stocke les gestes et automatismes.", keywords:["déclarative","sémantique","savoir factuel","procédurale","automatismes","gestes"] },
  { id:2003, c:3, type:"qcm", tag:"synthèse", q:"Un coach donne une prime après chaque bonne performance. Selon Deci et Harlon, quel risque pédagogique cela représente-t-il ?", opts:["Aucun risque, la récompense renforce toujours la motivation","La récompense externe peut détruire la motivation intrinsèque du joueur","Le joueur deviendra dépendant du sport","Le joueur développera de l'anxiété compétitive"], ans:1, exp:"Deci et Harlon : le renforcement tue la motivation intrinsèque. Les primes risquent de remplacer la passion par l'appât du gain.", keywords:["Deci","Harlon","motivation intrinsèque","récompense externe","renforcement","passion"] },
  { id:2004, c:0, type:"qcm", tag:"synthèse", q:"En quoi la méthode expérimentale est-elle SUPÉRIEURE à la méthode clinique pour étudier les causes d'un comportement ?", opts:["Elle est moins coûteuse","Elle permet d'établir des RELATIONS DE CAUSE À EFFET en contrôlant les variables","Elle s'applique à plus d'individus","Elle est plus rapide"], ans:1, exp:"La méthode expérimentale (VI→VD) permet d'établir des causalités. La méthode clinique décrit mais ne prouve pas la causalité.", keywords:["causalité","VI","VD","cause à effet","variables","expérimentale"] },
  { id:2005, c:2, type:"qcm", tag:"synthèse", q:"Quel concept de Piaget est DIRECTEMENT opposé à la réification de l'intelligence ?", opts:["L'assimilation","L'égocentrisme","La plasticité de l'intelligence (constructivisme)","La permanence de l'objet"], ans:2, exp:"Piaget montre que l'intelligence se CONSTRUIT progressivement → s'oppose à la réification (intelligence fixe et innée).", keywords:["constructivisme","se construit","progressivement","réification","fixe","innée"] },

  // ===== QUESTIONS APPLICATION =====
  { id:3001, c:5, type:"qcm", tag:"application", q:"🏃 Un préparateur physique ne termine pas la séance tant que les athlètes ne se sont pas étirés. Quel mécanisme béhavioriste utilise-t-il ?", opts:["Renforcement positif","Punition positive","Renforcement négatif","Extinction"], ans:2, exp:"Renforcement négatif = retirer un stimulus DÉSAGRÉABLE (rester) pour augmenter le comportement souhaité (s'étirer).", keywords:["renforcement négatif","retirer","stimulus désagréable","augmenter","Skinner"] },
  { id:3002, c:3, type:"qcm", tag:"application", q:"🏅 Un athlète sélectionné aux JO vit dans un pays en guerre et sa famille manque de nourriture. Selon Maslow, pourquoi sera-t-il peu performant ?", opts:["Son niveau de réalisation de soi est trop élevé","Ses besoins physiologiques et de sécurité (base de pyramide) ne sont pas satisfaits","Il manque de motivation intrinsèque","Son attachement à sa famille est trop fort"], ans:1, exp:"Maslow : les besoins de BASE (physiologiques + sécurité) doivent être satisfaits pour accéder aux niveaux supérieurs.", keywords:["Maslow","pyramide","physiologiques","sécurité","besoins de base","hiérarchie"] },
  { id:3003, c:1, type:"qcm", tag:"application", q:"📚 Un prof demande aux étudiants de réciter, dessiner et expliquer les stades de Piaget à leurs camarades. Selon Gates, pourquoi est-ce efficace ?", opts:["Car elle utilise la répétition mécanique","Car elle mobilise la récapitulation, le sur-apprentissage et le codage profond","Car elle exploite la mémoire sensorielle","Car elle renforce uniquement la mémoire épisodique"], ans:1, exp:"Gates : récapitulation + sur-apprentissage + codage profond (expliquer = traitement profond > relecture passive).", keywords:["Gates","récapitulation","sur-apprentissage","codage profond","feed-back","traitement profond"] },
  { id:3004, c:4, type:"qcm", tag:"application", q:"⚽ Les débutants ne voient pas les espaces libres sur le terrain, les experts oui. Quelle explication psychologique ?", opts:["Les experts ont une meilleure vue","Les débutants ont une mémoire plus faible","Les experts utilisent le Top-down : leur expérience guide leur perception","Les débutants utilisent trop leur proprioception"], ans:2, exp:"Top-down (Bruner) : l'expérience et les schémas cognitifs guident la perception. Les experts anticipent grâce à leurs connaissances.", keywords:["Top-down","Bruner","schémas cognitifs","expérience","anticiper","connaissances"] },
  { id:3005, c:6, type:"qcm", tag:"application", q:"🌱 Un enseignant propose des exercices légèrement au-dessus du niveau actuel de l'élève, réalisables avec un peu d'aide. Quel concept de Vygotsky applique-t-il ?", opts:["La maturation neurologique","La Zone Proximale de Développement (ZPD)","L'égocentrisme cognitif","L'étayage de Bruner"], ans:1, exp:"La ZPD = zone entre ce que l'élève peut faire seul et avec aide. C'est là que l'enseignement est OPTIMAL.", keywords:["ZPD","Vygotsky","niveau actuel","niveau potentiel","aide","enseignement optimal"] },
  { id:3006, c:2, type:"qcm", tag:"application", q:"🏊 Un entraîneur veut expliquer la pression de l'eau à des enfants de 6 ans. Selon Piaget, pourquoi est-ce difficile ?", opts:["Les enfants de 6 ans ont une mémoire insuffisante","À 6 ans (pré-opératoire), les enfants ne raisonnent pas encore sur des concepts abstraits","L'eau est trop complexe","La motivation intrinsèque fait défaut"], ans:1, exp:"Stade pré-opératoire (2-7 ans) : pensée concrète. L'entraîneur devrait utiliser des démonstrations concrètes.", keywords:["pré-opératoire","2-7 ans","pensée concrète","abstrait","Piaget","stade"] },
  { id:3007, c:0, type:"qcm", tag:"application", q:"📊 Un chercheur teste si la sophrologie réduit l'anxiété avant compétition. Que sont le programme de sophrologie et l'anxiété mesurée ?", opts:["VI = anxiété ; VD = sophrologie","VI = sophrologie (cause manipulée) ; VD = anxiété (effet mesuré)","Les deux sont des variables dépendantes","Ce sont des hypothèses, pas des variables"], ans:1, exp:"VI = sophrologie (cause manipulée). VD = niveau d'anxiété (effet observé).", keywords:["VI","VD","cause manipulée","effet observé","déterminisme causal","variable"] },
  { id:3008, c:5, type:"qcm", tag:"application", q:"🎾 Un coach ignore les colères de son joueur, mais le félicite dès qu'il garde son calme après une erreur. Quelle double technique béhavioriste utilise-t-il ?", opts:["Conditionnement classique (Pavlov)","Extinction + renforcement positif (Skinner)","Punition positive","Apprentissage vicariant (Bandura)"], ans:1, exp:"Ignorer = extinction. Féliciter = renforcement positif. Double technique de Skinner très utilisée en coaching.", keywords:["extinction","renforcement positif","Skinner","ignorer","féliciter","béhaviorisme"] },
];


function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function NavBar({ route, navigate }) {
  const tabs = [
    { id:"home", icon:"🏠", label:"Accueil" },
    { id:"quiz", icon:"🎯", label:"Quiz" },
    { id:"bio",  icon:"👤", label:"Biographies" },
  ];
  return (
    <div style={{ flexShrink:0, background:S.bg, borderTop:`2px solid ${S.border}`, display:"flex", width:"100%" }}>
      {tabs.map(t => {
        const active = route===t.id || (route==="quiz"&&t.id==="quiz") || (route==="bio"&&t.id==="bio");
        return (
          <button key={t.id} onClick={()=>navigate(t.id)} style={{ flex:1, padding:"10px 0 13px", background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <span style={{ fontSize:22, opacity:active?1:0.35 }}>{t.icon}</span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:active?S.accentLight:S.textMuted }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Welcome({ onStart }) {
  const [sel, setSel] = useState(new Set());
  const [inclReform, setInclReform] = useState(false);
  const [inclSynth,  setInclSynth]  = useState(false);
  const [inclApp,    setInclApp]    = useState(false);
  const toggle = id => setSel(p => { const s=new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });
  const pool = ALL_QUESTIONS.filter(q => {
    if(!sel.has(q.c)) return false;
    if(q.tag==="reformulé"   && !inclReform) return false;
    if(q.tag==="synthèse"    && !inclSynth)  return false;
    if(q.tag==="application" && !inclApp)    return false;
    return true;
  });
  const reformN = ALL_QUESTIONS.filter(q=>q.tag==="reformulé").length;
  const synthN  = ALL_QUESTIONS.filter(q=>q.tag==="synthèse").length;
  const appN    = ALL_QUESTIONS.filter(q=>q.tag==="application").length;

  return (
    <div style={{ padding:"24px 16px 32px", maxWidth:580, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:22 }}>
        <div style={{ display:"inline-block", background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.28)", borderRadius:100, padding:"5px 16px", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:S.accentLight, marginBottom:14 }}>
          PC1 STAPS — INJS
        </div>
        <h1 style={{ margin:"0 0 6px", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(30px,7vw,56px)", lineHeight:1.05, color:"#fff" }}>
          Quiz<br/>
          <span style={{ background:"linear-gradient(135deg,#a78bfa,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Psychologie</span>
        </h1>
        <p style={{ margin:0, color:S.textMuted, fontSize:13 }}>5 vies · −1 pt par erreur · Note sur 20</p>
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:18 }}>
        {[
          { label:"QCM",         n:ALL_QUESTIONS.filter(q=>q.type==="qcm").length, color:"#a78bfa" },
          { label:"Vrai/Faux",   n:ALL_QUESTIONS.filter(q=>q.type==="vf").length,  color:"#34d399" },
          { label:"Définitions", n:ALL_QUESTIONS.filter(q=>q.type==="def").length, color:"#fbbf24" },
        ].map(s=>(
          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:6, background:S.surface, border:`1px solid ${S.border}`, borderRadius:100, padding:"6px 14px", fontSize:12 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:s.color, flexShrink:0 }}/>
            <span style={{ color:S.textSecondary }}>{s.label}</span>
            <strong style={{ color:s.color }}>{s.n}</strong>
          </div>
        ))}
      </div>
      <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, overflow:"hidden", marginBottom:14 }}>
        <div style={{ padding:"12px 16px 10px", borderBottom:`1px solid ${S.border}` }}>
          <span style={{ fontSize:11, fontWeight:700, color:S.textMuted, textTransform:"uppercase", letterSpacing:"0.08em" }}>✨ Nouvelles questions</span>
        </div>
        {[
          { key:"reformulé", n:reformN, val:inclReform, set:setInclReform, desc:"Reformulées différemment" },
          { key:"synthèse",  n:synthN,  val:inclSynth,  set:setInclSynth,  desc:"Comparaisons entre théories" },
          { key:"application",n:appN,   val:inclApp,    set:setInclApp,    desc:"Mises en situation sport/péda." },
        ].map((row, i, arr) => (
          <div key={row.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"11px 16px", borderBottom: i<arr.length-1?`1px solid ${S.border}`:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100, background:TAG_STYLES[row.key].bg, color:TAG_STYLES[row.key].color, border:`1px solid ${TAG_STYLES[row.key].border}`, whiteSpace:"nowrap", flexShrink:0 }}>{TAG_STYLES[row.key].label} ×{row.n}</span>
              <span style={{ fontSize:12, color:S.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.desc}</span>
            </div>
            <button onClick={()=>row.set(!row.val)} style={{ width:38, height:22, borderRadius:100, background:row.val?S.accent:S.surface2, border:`1px solid ${row.val?S.accent:S.border}`, transition:"background .2s", flexShrink:0, position:"relative", cursor:"pointer" }}>
              <div style={{ position:"absolute", top:3, left:row.val?19:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
            </button>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:12 }}>
        {[["Tout sélectionner",()=>setSel(new Set([0,1,2,3,4,5,6]))],["Tout désélectionner",()=>setSel(new Set())]].map(([lbl,fn])=>(
          <button key={lbl} onClick={fn} style={{ background:"transparent", border:`1px solid ${S.border}`, borderRadius:100, padding:"7px 14px", color:S.textMuted, fontSize:12, fontWeight:600, cursor:"pointer" }}>{lbl}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:9, marginBottom:16 }}>
        {CHAPTERS.map(ch => {
          const active=sel.has(ch.id);
          const cnt=ALL_QUESTIONS.filter(q=>q.c===ch.id).length;
          return (
            <button key={ch.id} onClick={()=>toggle(ch.id)} style={{ position:"relative", background:active?"rgba(124,58,237,0.1)":S.surface, border:`1px solid ${active?"rgba(124,58,237,0.5)":S.border}`, borderRadius:14, padding:"14px 12px 12px", cursor:"pointer", textAlign:"left" }}>
              <div style={{ position:"absolute", top:9, right:9, width:18, height:18, borderRadius:"50%", background:active?"#7c3aed":"transparent", border:`1px solid ${active?"#7c3aed":S.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", fontWeight:800 }}>{active?"✓":""}</div>
              <div style={{ fontSize:22, marginBottom:5 }}>{ch.icon}</div>
              <div style={{ fontSize:12, fontWeight:600, color:active?S.textPrimary:S.textMuted, lineHeight:1.3 }}>{ch.label}</div>
              <div style={{ fontSize:11, color:S.textMuted, marginTop:3 }}>{cnt} q.</div>
            </button>
          );
        })}
      </div>
      <p style={{ textAlign:"center", color:S.textMuted, fontSize:13, marginBottom:16 }}>{pool.length} question{pool.length>1?"s":""} sélectionnée{pool.length>1?"s":""}</p>
      <button disabled={pool.length===0} onClick={()=>onStart(pool)} style={{ display:"block", width:"100%", padding:"15px", borderRadius:14, border:"none", background:pool.length===0?S.surface2:`linear-gradient(135deg,${S.accent},#5b21b6)`, color:pool.length===0?S.textMuted:"#fff", fontSize:16, fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:pool.length===0?"not-allowed":"pointer", boxShadow:pool.length>0?"0 4px 20px rgba(124,58,237,0.3)":"none" }}>
        Commencer →
      </button>
    </div>
  );
}

function Quiz({ questions, onFinish }) {
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
  const [animKey,setAnimKey]=useState(0);
  const q=questions[idx];
  const chap=CHAPTERS.find(c=>c.id===q?.c);
  const pct=Math.round((idx/questions.length)*100);
  const LETTERS=["A","B","C","D"];
  const advance=useCallback((nl,nc,nw,ns2,score)=>{
    if(nl<=0){
      setTimeout(()=>onFinish({lives:0,correctCount:nc,wrongCount:nw,skippedCount:ns2,scoreRaw:score,total:questions.length}),1200);
    }
  },[onFinish]);
  const goNext=useCallback(()=>{
    const nxt=idx+1;
    if(nxt>=questions.length){
      onFinish({lives,correctCount,wrongCount,skippedCount,scoreRaw,total:questions.length});
    } else {
      setIdx(nxt);setAnswered(false);setFeedback(null);setChosen(null);setDefText("");setAnimKey(k=>k+1);
    }
  },[idx,questions.length,lives,correctCount,wrongCount,skippedCount,scoreRaw,onFinish]);
  const doCorrect=useCallback(()=>{const nc=correctCount+1,score=scoreRaw+1;setCorrectCount(nc);setScoreRaw(score);setFeedback({type:"ok",msg:"✅ Bonne réponse ! +1 point",exp:q.exp});advance(lives,nc,wrongCount,skippedCount,score);},[q,lives,correctCount,wrongCount,skippedCount,scoreRaw,advance]);
  const doWrong=useCallback(()=>{const nl=lives-1,nw=wrongCount+1,score=scoreRaw-1;setLives(nl);setWrongCount(nw);setScoreRaw(score);setFeedback({type:"bad",msg:`❌ Mauvaise réponse — −1 pt  ❤️ ${nl}/5`,exp:q.exp});advance(nl,correctCount,nw,skippedCount,score);},[q,lives,correctCount,wrongCount,skippedCount,scoreRaw,advance]);
  const doSkip=useCallback(()=>{if(answered)return;setAnswered(true);const ns2=skippedCount+1;setSkippedCount(ns2);setFeedback({type:"skip",msg:"⏭ Question passée — 0 point",exp:q.exp});advance(lives,correctCount,wrongCount,ns2,scoreRaw);},[answered,q,lives,correctCount,wrongCount,skippedCount,scoreRaw,advance]);
  const ansQCM=i=>{if(answered)return;setAnswered(true);setChosen(i);if(i===q.ans)doCorrect();else doWrong();};
  const ansVF=v=>{if(answered)return;setAnswered(true);setChosen(v);if(v===q.ans)doCorrect();else doWrong();};
  const ansDef=()=>{if(answered||!defText.trim())return;setAnswered(true);const lower=defText.toLowerCase();const found=q.keywords.filter(k=>lower.includes(k.toLowerCase()));if(found.length/q.keywords.length>=0.4)doCorrect();else doWrong();};
  if(!q)return null;
  const fbStyle=feedback?{ok:{bg:"rgba(16,185,129,0.1)",border:"rgba(16,185,129,0.3)",color:"#34d399"},bad:{bg:"rgba(239,68,68,0.1)",border:"rgba(239,68,68,0.3)",color:"#f87171"},skip:{bg:"rgba(245,158,11,0.1)",border:"rgba(245,158,11,0.3)",color:"#fbbf24"}}[feedback.type]:null;
  const typeBadge={qcm:{bg:"rgba(124,58,237,0.15)",color:"#a78bfa",border:"rgba(124,58,237,0.3)",label:"QCM"},vf:{bg:"rgba(16,185,129,0.12)",color:"#34d399",border:"rgba(16,185,129,0.25)",label:"VRAI / FAUX"},def:{bg:"rgba(245,158,11,0.12)",color:"#fbbf24",border:"rgba(245,158,11,0.25)",label:"DÉFINITION"}}[q.type];
  const tagStyle=q.tag?TAG_STYLES[q.tag]:null;
  return (
    <div style={{ padding:"18px 14px 28px", maxWidth:560, margin:"0 auto" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <div style={{ display:"flex", gap:4, flexShrink:0 }}>
          {[...Array(5)].map((_,i)=>(<span key={i} style={{ fontSize:17, opacity:i<lives?1:0.18, display:"inline-block", transform:i<lives?"scale(1)":"scale(0.75)", transition:"all .25s" }}>❤️</span>))}
        </div>
        <div style={{ flex:1, height:5, background:S.surface2, borderRadius:100, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${S.accent},${S.accentLight})`, borderRadius:100, transition:"width .5s ease" }}/>
        </div>
        <span style={{ fontSize:12, color:S.textMuted, whiteSpace:"nowrap", flexShrink:0 }}>{idx+1}/{questions.length}</span>
      </div>
      <div key={animKey} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:20, padding:"18px 16px", marginBottom:10, animation:"fadeUp .25s ease" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:7, marginBottom:13 }}>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 12px", borderRadius:100, background:typeBadge.bg, color:typeBadge.color, border:`1px solid ${typeBadge.border}` }}>{typeBadge.label}</span>
            {tagStyle&&<span style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:100, background:tagStyle.bg, color:tagStyle.color, border:`1px solid ${tagStyle.border}` }}>{tagStyle.label}</span>}
          </div>
          <span style={{ fontSize:11, color:S.textMuted }}>{chap.icon} {chap.label}</span>
        </div>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"clamp(14px,3.5vw,17px)", color:S.textPrimary, lineHeight:1.5, marginBottom:16 }}>{q.q}</p>
        {q.type==="qcm"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {q.opts.map((opt,i)=>{
              let bg=S.surface2,border=`1px solid ${S.border}`,color=S.textSecondary;
              if(answered){if(i===q.ans){bg="rgba(16,185,129,0.1)";border="1px solid #10b981";color="#34d399";}else if(i===chosen){bg="rgba(239,68,68,0.1)";border="1px solid #ef4444";color="#f87171";}else{bg=S.surface;color=S.textMuted;}}
              return(<button key={i} disabled={answered} onClick={()=>ansQCM(i)} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"11px 13px", background:bg, border, borderRadius:12, color, fontSize:13, fontWeight:500, textAlign:"left", cursor:answered?"default":"pointer", transition:"all .15s" }}>
                <span style={{ width:24, height:24, borderRadius:8, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, background:answered&&i===q.ans?"#10b981":answered&&i===chosen?"#ef4444":"rgba(255,255,255,0.05)", color:answered&&(i===q.ans||i===chosen)?"#fff":S.textMuted, border:answered&&i===q.ans?"1px solid #10b981":answered&&i===chosen?"1px solid #ef4444":`1px solid ${S.border}` }}>{LETTERS[i]}</span>{opt}
              </button>);
            })}
          </div>
        )}
        {q.type==="vf"&&(
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[true,false].map(val=>{
              const isAns=val===q.ans,isCho=val===chosen;
              let bg=S.surface2,border=`1px solid ${S.border}`,color=S.textSecondary;
              if(answered){if(isAns){bg="rgba(16,185,129,0.1)";border="1px solid #10b981";color="#34d399";}else if(isCho){bg="rgba(239,68,68,0.1)";border="1px solid #ef4444";color="#f87171";}else{bg=S.surface;color=S.textMuted;}}
              return(<button key={String(val)} disabled={answered} onClick={()=>ansVF(val)} style={{ padding:"16px 8px", borderRadius:14, border, background:bg, color, fontSize:14, fontWeight:800, fontFamily:"'Syne',sans-serif", cursor:answered?"default":"pointer", transition:"all .15s" }}>{val?"✅ VRAI":"❌ FAUX"}</button>);
            })}
          </div>
        )}
        {q.type==="def"&&(
          <div>
            <div style={{ padding:"9px 12px", background:"rgba(124,58,237,0.06)", border:`1px solid rgba(124,58,237,0.2)`, borderRadius:10, marginBottom:8 }}>
              <p style={{ fontSize:11, fontWeight:700, color:S.accentLight, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>🔑 Mots-clés à inclure</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{q.keywords.map((kw,i)=>(<span key={i} style={{ fontSize:11, padding:"3px 9px", borderRadius:100, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", color:"#a78bfa", fontWeight:500 }}>{kw}</span>))}</div>
            </div>
            <textarea value={defText} onChange={e=>setDefText(e.target.value)} disabled={answered} placeholder="Rédigez votre définition ici…" style={{ width:"100%", minHeight:85, background:S.surface2, border:`1px solid ${S.border}`, borderRadius:12, padding:"11px 13px", color:S.textPrimary, fontSize:13, fontFamily:"inherit", resize:"vertical", outline:"none", boxSizing:"border-box" }}/>
            {!answered&&(<div style={{ display:"flex", gap:8, marginTop:10 }}><button onClick={ansDef} disabled={!defText.trim()} style={{ flex:1, padding:"11px", borderRadius:12, border:"none", background:defText.trim()?`linear-gradient(135deg,${S.accent},#5b21b6)`:S.surface2, color:defText.trim()?"#fff":S.textMuted, fontSize:13, fontWeight:700, cursor:defText.trim()?"pointer":"not-allowed" }}>✅ Valider</button><button onClick={doSkip} style={{ flex:1, padding:"11px", borderRadius:12, border:`1px solid ${S.border}`, background:S.surface, color:S.textMuted, fontSize:13, fontWeight:600, cursor:"pointer" }}>⏭ Passer</button></div>)}
            {answered&&(<div style={{ marginTop:12 }}>
              <div style={{ padding:"12px 14px", background:S.surface2, border:`1px solid ${S.border}`, borderRadius:"12px 12px 0 0" }}>
                <p style={{ fontSize:11, fontWeight:700, color:S.textMuted, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>📖 Réponse modèle</p>
                <p style={{ fontSize:12, color:S.textSecondary, lineHeight:1.6, margin:0 }}>{q.answer}</p>
              </div>
              <div style={{ padding:"10px 14px", background:"rgba(124,58,237,0.08)", border:`1px solid rgba(124,58,237,0.25)`, borderTop:"none", borderRadius:"0 0 12px 12px" }}>
                <p style={{ fontSize:11, fontWeight:700, color:S.accentLight, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>🔑 Mots-clés attendus</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{q.keywords.map((kw,i)=>(<span key={i} style={{ fontSize:11, padding:"3px 9px", borderRadius:100, background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", color:"#a78bfa", fontWeight:600 }}>{kw}</span>))}</div>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
                <button onClick={goNext} style={{ padding:"9px 20px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${S.accent},#5b21b6)`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Question suivante →</button>
              </div>
            </div>)}
          </div>
        )}
        {feedback&&fbStyle&&(
          <div style={{ marginTop:14, borderRadius:14, overflow:"hidden" }}>
            <div style={{ padding:"12px 15px", background:fbStyle.bg, border:`1px solid ${fbStyle.border}`, borderRadius:q.keywords?"14px 14px 0 0":"14px" }}>
              <p style={{ color:fbStyle.color, fontWeight:700, fontSize:13, margin:"0 0 4px" }}>{feedback.msg}</p>
              <p style={{ color:S.textMuted, fontSize:12, lineHeight:1.5, margin:0 }}>{feedback.exp}</p>
            </div>
            {q.keywords&&(
              <div style={{ padding:"10px 14px", background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.25)", borderTop:"none", borderRadius:"0 0 14px 14px" }}>
                <p style={{ fontSize:11, fontWeight:700, color:S.accentLight, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>🔑 Mots-clés</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{q.keywords.map((kw,i)=>(<span key={i} style={{ fontSize:11, padding:"3px 9px", borderRadius:100, background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.3)", color:"#a78bfa", fontWeight:600 }}>{kw}</span>))}</div>
              </div>
            )}
          </div>
        )}
      </div>
      {!answered&&q.type!=="def"&&(<div style={{ display:"flex", justifyContent:"flex-end" }}><button onClick={doSkip} style={{ padding:"8px 18px", borderRadius:12, border:`1px solid ${S.border}`, background:S.surface, color:S.textMuted, fontSize:12, fontWeight:600, cursor:"pointer" }}>⏭ Passer</button></div>)}
      {answered&&lives>0&&(<div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}><button onClick={goNext} style={{ padding:"9px 20px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${S.accent},#5b21b6)`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Question suivante →</button></div>)}
    </div>
  );
}

function Results({ result, onReplay }) {
  const {lives,correctCount,wrongCount,skippedCount,scoreRaw,total}=result;
  const lost=lives<=0;
  const pct=total?Math.round((correctCount/total)*100):0;
  const note20=total?Math.max(0,Math.min(20,(Math.max(0,scoreRaw)/total)*20)):0;
  const note20str=Number.isInteger(note20)?note20:note20.toFixed(1);
  const mention=note20>=16?{text:"Très bien 🎉",c:"#34d399"}:note20>=14?{text:"Bien 😊",c:"#34d399"}:note20>=12?{text:"Assez bien 👍",c:"#fbbf24"}:note20>=10?{text:"Passable 😐",c:"#fb923c"}:{text:"À retravailler 📖",c:"#f87171"};
  const noteColor=note20>=12?"#34d399":note20>=8?"#fbbf24":"#f87171";
  const r=52,circ=2*Math.PI*r;
  const ringColor=pct>=75?"#34d399":pct>=50?"#fbbf24":"#f87171";
  return (
    <div style={{ padding:"36px 16px 32px", maxWidth:420, margin:"0 auto", textAlign:"center" }}>
      <div style={{ fontSize:58, marginBottom:10 }}>{lost?"💔":pct>=75?"🏆":pct>=50?"👏":"📖"}</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(22px,7vw,40px)", color:"#fff", margin:"0 0 6px" }}>{lost?"Game Over !":pct>=75?"Excellent !":pct>=50?"Bien joué !":"Continue à réviser !"}</h2>
      <p style={{ color:S.textMuted, fontSize:14, marginBottom:20 }}>{lost?"Tu as perdu tous tes cœurs…":`Quiz terminé — ${total} questions`}</p>
      <div style={{ marginBottom:4 }}><span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:52, color:noteColor }}>{note20str}</span><span style={{ fontWeight:700, fontSize:20, color:S.textMuted }}>/20</span></div>
      <p style={{ fontSize:15, fontWeight:700, color:mention.c, marginBottom:24 }}>{mention.text}</p>
      <div style={{ position:"relative", width:130, height:130, margin:"0 auto 22px" }}>
        <svg viewBox="0 0 120 120" style={{ width:"100%", height:"100%", transform:"rotate(-90deg)" }}>
          <circle cx="60" cy="60" r={r} fill="none" stroke={S.surface2} strokeWidth="9"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke={ringColor} strokeWidth="9" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-(circ*pct/100)} style={{ transition:"stroke-dashoffset 1.2s ease" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color:ringColor }}>{pct}%</span>
          <span style={{ fontSize:11, color:S.textMuted }}>{correctCount}/{total}</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
        {[{v:correctCount,l:"Bonnes",c:"#34d399",i:"✅"},{v:wrongCount,l:"Mauvaises",c:"#f87171",i:"❌"},{v:skippedCount,l:"Passées",c:"#fbbf24",i:"⏭"}].map(s=>(
          <div key={s.l} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:"14px 6px" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11, color:S.textMuted, marginTop:2 }}>{s.i} {s.l}</div>
          </div>
        ))}
      </div>
      <button onClick={onReplay} style={{ width:"100%", padding:"15px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${S.accent},#5b21b6)`, color:"#fff", fontSize:15, fontWeight:700, fontFamily:"'Syne',sans-serif", cursor:"pointer", boxShadow:"0 4px 20px rgba(124,58,237,0.3)" }}>🔄 Rejouer</button>
    </div>
  );
}

function Biographies() {
  const [selected, setSelected] = useState(null);
  if(selected){
    const b=selected;
    return (
      <div style={{ padding:"18px 16px 28px", maxWidth:560, margin:"0 auto" }}>
        <button onClick={()=>setSelected(null)} style={{ background:"transparent", border:"none", color:S.textMuted, fontSize:14, cursor:"pointer", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>← Retour</button>
        <div style={{ background:`linear-gradient(135deg,${b.color}22,${b.color}08)`, border:`1px solid ${b.color}44`, borderRadius:22, padding:"22px 18px", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
            <div style={{ width:60, height:60, borderRadius:18, background:`linear-gradient(135deg,${b.color},${b.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:"#fff", flexShrink:0 }}>{b.avatar}</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}><span style={{ fontSize:17 }}>{b.flag}</span><span style={{ fontSize:12, color:S.textMuted }}>{b.dates}</span></div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(18px,4vw,22px)", color:"#fff", margin:0, lineHeight:1.2 }}>{b.name}</h2>
              <p style={{ fontSize:12, color:b.color, fontWeight:600, margin:"4px 0 0" }}>{b.role}</p>
            </div>
          </div>
          <div style={{ borderLeft:`3px solid ${b.color}`, paddingLeft:14 }}>
            <p style={{ fontSize:13, fontStyle:"italic", color:S.textSecondary, margin:0, lineHeight:1.6 }}>« {b.quote} »</p>
          </div>
        </div>
        <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:18, padding:"16px", marginBottom:12 }}>
          <p style={{ fontSize:11, fontWeight:700, color:S.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Points clés à retenir</p>
          {b.facts.map((f,i)=>(
            <div key={i} style={{ display:"flex", gap:12, marginBottom:i<b.facts.length-1?10:0 }}>
              <div style={{ width:24, height:24, borderRadius:8, background:`${b.color}22`, border:`1px solid ${b.color}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:12, fontWeight:800, color:b.color }}>{i+1}</div>
              <p style={{ fontSize:13, color:S.textSecondary, lineHeight:1.5, margin:0 }}>{f}</p>
            </div>
          ))}
        </div>
        <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:18, padding:"14px" }}>
          <p style={{ fontSize:11, fontWeight:700, color:S.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Chapitres du cours</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {b.chapters.map(cId=>{ const ch=CHAPTERS.find(c=>c.id===cId); return ch?<span key={cId} style={{ fontSize:12, padding:"6px 14px", borderRadius:100, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.3)", color:S.accentLight, fontWeight:600 }}>{ch.icon} {ch.label}</span>:null; })}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding:"22px 16px 24px", maxWidth:560, margin:"0 auto" }}>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(22px,5vw,32px)", color:"#fff", margin:"0 0 5px" }}>👤 Biographies</h2>
      <p style={{ color:S.textMuted, fontSize:13, marginBottom:18 }}>Les auteurs clés de votre cours</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {BIOGRAPHIES.map(b=>(
          <button key={b.id} onClick={()=>setSelected(b)} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:"14px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left", width:"100%" }}>
            <div style={{ width:50, height:50, borderRadius:14, background:`linear-gradient(135deg,${b.color},${b.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#fff", flexShrink:0 }}>{b.avatar}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:S.textPrimary }}>{b.name}</span>
                <span style={{ fontSize:13 }}>{b.flag}</span>
              </div>
              <p style={{ fontSize:11, color:S.textMuted, margin:"0 0 5px", lineHeight:1.4 }}>{b.dates} · {b.role}</p>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {b.chapters.map(cId=>{ const ch=CHAPTERS.find(c=>c.id===cId); return ch?<span key={cId} style={{ fontSize:10, padding:"2px 8px", borderRadius:100, background:"rgba(124,58,237,0.1)", color:S.accentLight, fontWeight:600 }}>{ch.icon} {ch.label}</span>:null; })}
              </div>
            </div>
            <span style={{ color:S.textMuted, fontSize:18, flexShrink:0 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { route, navigate } = useRouter();
  const [quizScreen, setQuizScreen] = useState("welcome");
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const goQuiz = () => { navigate("quiz"); setQuizScreen("welcome"); };

  const showNav = quizScreen !== "playing";

  const navBar = showNav ? (
    <NavBar
      route={route}
      navigate={(r) => { if(r==="quiz") goQuiz(); else navigate(r); }}
    />
  ) : null;

  let content;
  if(route === "bio") {
    content = <Biographies />;
  } else if(route === "quiz" && quizScreen === "playing") {
    content = <Quiz questions={questions} onFinish={(r)=>{setResult(r);setQuizScreen("results");}}/>;
  } else if(route === "quiz" && quizScreen === "results") {
    content = <Results result={result} onReplay={goQuiz}/>;
  } else {
    content = <Welcome onStart={(pool)=>{setQuestions(shuffle(pool));navigate("quiz");setQuizScreen("playing");}}/>;
  }

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      button { font-family: 'DM Sans', sans-serif; }
      textarea { font-family: 'DM Sans', sans-serif; }
    `;
    document.head.appendChild(style);
    let el = document.getElementById('root');
    while (el && el !== document.body.parentElement) {
      el.style.cssText += 'width:100%!important;height:100%!important;overflow:hidden!important;margin:0!important;padding:0!important;';
      el = el.parentElement;
    }
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      display: "flex",
      flexDirection: "column",
      background: S.bg,
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {content}
      </div>
      {navBar}
    </div>
  );
}