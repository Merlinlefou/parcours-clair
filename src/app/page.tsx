"use client";

import { useState } from "react";
import formationsData from "@/data/formations.json";

interface Formation {
  id: string;
  nom: string;
  domaine: string;
  frais_scolarite_annuels: number;
  duree_formation_ans: number;
  taux_acces_parcoursup: number;
  selection_master: {
    difficulte: string;
    taux_estime: string;
  };
  arret_licence: {
    niveau_debouchés: string;
    taux_insertion_30m: number;
    salaire_median_net: number;
    remarque: string;
  };
  poursuite_master: {
    niveau_debouchés: string;
    taux_insertion_30m: number;
    salaire_median_net: number;
    metiers_cibles: string[];
    alerte_ia: string;
  };
  plan_b: {
    nom: string;
    avantage: string;
  };
}

export default function Home() {
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [logementIndependant, setLogementIndependant] = useState(false);
  const [ficheSelectionnee, setFicheSelectionnee] = useState<Formation | null>(
    null,
  );
  const [panierVoeux, setPanierVoeux] = useState<string[]>([]);

  const [limiteAffichage, setLimiteAffichage] = useState(21);

  const [domaineActif, setDomaineActif] = useState("Tous");
  const domaines = [
    "Tous",
    "Droit & Gestion",
    "Ingénierie & Info",
    "Sciences",
    "Santé",
    "Lettres",
  ];

  const coutLogementAnnuel = logementIndependant ? 5000 : 0;

  const toggleVoeu = (id: string) => {
    setPanierVoeux((prev) =>
      prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id],
    );
  };

  const formationsFiltrees = (formationsData as Formation[]).filter((f) => {
    const matchRecherche =
      f.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      f.domaine.toLowerCase().includes(recherche.toLowerCase());
    const matchDomaine =
      domaineActif === "Tous" || f.domaine.includes(domaineActif);

    return matchRecherche && matchDomaine;
  });

  const formationsAffichees = formationsFiltrees.slice(0, limiteAffichage);

  const handleRecherche = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecherche(e.target.value);
    setLimiteAffichage(21);
  };

  const getBadgeStyle = (niveau: string) => {
    switch (niveau.toLowerCase()) {
      case "forts":
      case "études de santé (6-11 ans)":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";
      case "moyens":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";
      case "faibles":
      case "spécifique (1 an)":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20";
      default:
        return "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* Navigation supérieure */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              P
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base">
                Parcours<span className="text-blue-600">Clair</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Observatoire
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setLogementIndependant(false)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  !logementIndependant
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Chez les parents
              </button>
              <button
                type="button"
                onClick={() => setLogementIndependant(true)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  logementIndependant
                    ? "bg-white text-blue-600 font-semibold shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Logement étudiant (+500€/m)
              </button>
            </div>

            <button
              onClick={() => setPanierOuvert(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
            >
              <span>Vœux sauvegardés</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                {panierVoeux.length}/10
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Barre de recherche */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-10">
        <div className="max-w-3xl mb-8">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-4">
            Ne choisis pas tes études{" "}
            <span className="text-blue-600">à l'aveugle</span>.
          </h2>
          <p className="text-lg text-slate-600 font-medium mb-6">
            Le premier observatoire indépendant qui croise les vrais salaires
            post-diplôme, les coûts cachés (logement) et les taux de sélection
            réels (MonMaster).
          </p>

          {/* Comment ça marche - 3 points */}
          <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-700 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">📊</span> Données
              Officielles SIES
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">💶</span> Salaires
              réindexés 2026
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">🎯</span> Transparence
              sélection
            </div>
          </div>
        </div>

        <div className="relative max-w-2xl mb-5">
          <input
            type="text"
            placeholder="Rechercher une filière (ex: Droit, Chimie, PASS)..."
            value={recherche}
            onChange={handleRecherche}
            className="w-full pl-5 pr-10 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          {recherche && (
            <button
              onClick={() => {
                setRecherche("");
                setLimiteAffichage(21);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs font-bold transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Raccourcis / Exemples percutants */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="font-semibold text-slate-500">
            💡 Cas concrets à voir :
          </span>
          <button
            type="button"
            onClick={() => {
              setRecherche("Psychologie");
              setDomaineActif("Tous");
              setLimiteAffichage(21);
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition font-medium"
          >
            ⚠️ Psycho (Goulot Master)
          </button>
          <button
            type="button"
            onClick={() => {
              setRecherche("Droit");
              setDomaineActif("Tous");
              setLimiteAffichage(21);
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/80 hover:bg-rose-100 transition font-medium"
          >
            🚨 Droit (Pression sélection)
          </button>
          <button
            type="button"
            onClick={() => {
              setRecherche("BUT");
              setDomaineActif("Tous");
              setLimiteAffichage(21);
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition font-medium"
          >
            ✅ BUT (Alternative rentable)
          </button>
        </div>

        {/* Filtres Rapides par Domaine */}
        <div className="flex flex-wrap gap-2 max-w-3xl">
          {domaines.map((domaine) => (
            <button
              key={domaine}
              onClick={() => {
                setDomaineActif(domaine);
                setLimiteAffichage(21);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                domaineActif === domaine
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {domaine}
            </button>
          ))}
        </div>
      </section>

      {/* Grille principale */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {formationsAffichees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 border-dashed col-span-full">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Aucune formation trouvée
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6 mx-auto">
                Essayez de modifier votre recherche ou de changer de domaine
                pour voir plus de résultats.
              </p>
              <button
                onClick={() => {
                  setRecherche("");
                  setDomaineActif("Tous");
                  setLimiteAffichage(21);
                }}
                className="px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            formationsAffichees.map((f) => {
              const duree = f.duree_formation_ans || 5;
              const coutTotalGlobal =
                (f.frais_scolarite_annuels + coutLogementAnnuel) * duree;
              const estDansVoeux = panierVoeux.includes(f.id);

              return (
                <div
                  key={f.id}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {f.domaine}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVoeu(f.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                          estDansVoeux
                            ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {estDansVoeux ? "✓ Ajouté" : "+ Vœu"}
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {f.nom}
                    </h3>

                    {/* Indicateur de tension Master */}
                    {!f.domaine.includes("Concours Médical") &&
                      f.selection_master && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-[10px] font-medium text-slate-600">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              f.selection_master.difficulte
                                .toLowerCase()
                                .includes("forte") ||
                              f.selection_master.difficulte
                                .toLowerCase()
                                .includes("extrême")
                                ? "bg-rose-500"
                                : f.selection_master.difficulte
                                      .toLowerCase()
                                      .includes("modérée")
                                  ? "bg-amber-400"
                                  : "bg-emerald-500"
                            }`}
                          ></span>
                          Sélection Master : {f.selection_master.difficulte}
                        </div>
                      )}

                    <div className="grid grid-cols-2 gap-2 my-4">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium">
                          Taux d'accès
                        </div>
                        <div className="text-base font-extrabold text-slate-800">
                          {f.taux_acces_parcoursup}%
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-400 font-medium">
                          Coût ({duree} an{duree > 1 ? "s" : ""})
                        </div>
                        <div className="text-base font-extrabold text-slate-800">
                          {coutTotalGlobal.toLocaleString()} €
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                        <span className="text-slate-600">Statut initial :</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getBadgeStyle(f.arret_licence.niveau_debouchés)}`}
                        >
                          {f.arret_licence.niveau_debouchés}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/40 border border-blue-100">
                        <span className="text-slate-700 font-medium">
                          {f.domaine.includes("Concours Médical")
                            ? "Cursus visé :"
                            : "Sortie Bac+5 :"}
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">
                            {f.domaine.includes("Concours Médical")
                              ? "Études de santé"
                              : `${f.poursuite_master.salaire_median_net} €`}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {f.domaine.includes("Concours Médical")
                              ? "Cycle long (6-11 ans)"
                              : "médian net/mois"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFicheSelectionnee(f)}
                    className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition text-center"
                  >
                    Voir l'analyse complète →
                  </button>
                </div>
              );
            })
          )}
        </div>

        {formationsFiltrees.length > limiteAffichage && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setLimiteAffichage((prev) => prev + 21)}
              className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
            >
              Afficher plus de résultats (
              {formationsFiltrees.length - limiteAffichage} restants)
            </button>
          </div>
        )}
      </section>

      {/* Modal / Fiche complète */}
      {ficheSelectionnee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {ficheSelectionnee.domaine}
                </span>
                <h3 className="text-2xl font-black text-slate-950 mt-1">
                  {ficheSelectionnee.nom}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFicheSelectionnee(null)}
                className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Encadré 1 : Bilan de l'année / Arrêt */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    {ficheSelectionnee.domaine.includes("Concours Médical")
                      ? "Issue du PASS (1re année)"
                      : "Arrêt après la licence"}
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getBadgeStyle(ficheSelectionnee.arret_licence.niveau_debouchés)}`}
                  >
                    {ficheSelectionnee.domaine.includes("Concours Médical")
                      ? "Passerelle"
                      : `Débouchés ${ficheSelectionnee.arret_licence.niveau_debouchés}`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  {ficheSelectionnee.arret_licence.remarque}
                </p>
                <div className="flex gap-4 text-xs font-medium text-slate-700">
                  {ficheSelectionnee.domaine.includes("Concours Médical") ? (
                    <span>
                      Statut : <strong>Concours / Réorientation</strong>
                    </span>
                  ) : (
                    <>
                      <span>
                        Insertion :{" "}
                        <strong>
                          {ficheSelectionnee.arret_licence.taux_insertion_30m}%
                        </strong>
                      </span>
                      <span>
                        Salaire :{" "}
                        <strong>
                          {ficheSelectionnee.arret_licence.salaire_median_net} €
                          net
                        </strong>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Encadré 2 : Poursuite d'études / Master */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-sm text-blue-950">
                    {ficheSelectionnee.domaine.includes("Concours Médical")
                      ? "Poursuite en Études de Santé (Cycle Long)"
                      : "Débouchés après Master (Bac+5)"}
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getBadgeStyle(ficheSelectionnee.poursuite_master.niveau_debouchés)}`}
                  >
                    {ficheSelectionnee.poursuite_master.niveau_debouchés}
                  </span>
                </div>
                <div className="text-xs text-slate-700 mb-3">
                  {ficheSelectionnee.domaine.includes("Concours Médical") ? (
                    <span>
                      Cursus : <strong>Études de santé de 6 à 11 ans</strong>{" "}
                      (Médecine, Dentaire, Sage-femme, Pharmacie, Kiné)
                    </span>
                  ) : (
                    <>
                      Salaire net médian à 30 mois :{" "}
                      <strong>
                        {ficheSelectionnee.poursuite_master.salaire_median_net}{" "}
                        € / mois
                      </strong>{" "}
                      (Insertion à{" "}
                      {ficheSelectionnee.poursuite_master.taux_insertion_30m}%)
                    </>
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    {ficheSelectionnee.domaine.includes("Concours Médical")
                      ? "Débouchés visés après le concours :"
                      : "Métiers visés :"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ficheSelectionnee.poursuite_master.metiers_cibles.map(
                      (m, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 px-3 py-1 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs"
                        >
                          {m}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Encadré 3 : Sélection / Accès */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
                <div className="font-bold text-rose-900 mb-1">
                  {ficheSelectionnee.domaine.includes("Concours Médical")
                    ? "Modalité d'accès aux études de santé"
                    : "Passage en Master (Plateforme MonMaster)"}
                </div>
                <p className="text-rose-800">
                  {ficheSelectionnee.domaine.includes("Concours Médical")
                    ? "Type de sélection :"
                    : "Difficulté de sélection :"}{" "}
                  <strong>
                    {ficheSelectionnee.selection_master?.difficulte ||
                      "Non spécifiée"}
                  </strong>
                </p>
                <p className="text-rose-800">
                  {ficheSelectionnee.domaine.includes("Concours Médical")
                    ? "Taux de réussite :"
                    : "Taux d'accès estimé :"}{" "}
                  <strong>
                    {ficheSelectionnee.selection_master?.taux_estime || "N/A"}
                  </strong>
                </p>
              </div>

              {/* Grille Plan B & IA */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900 mb-1">
                    Plan B recommandé
                  </div>
                  <strong className="block text-amber-950">
                    {ficheSelectionnee.plan_b.nom}
                  </strong>
                  <p className="text-amber-800/90 mt-1">
                    {ficheSelectionnee.plan_b.avantage}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs">
                  <div className="font-bold text-indigo-900 mb-1">
                    Impact / Contexte
                  </div>
                  <p className="text-indigo-800/90">
                    {ficheSelectionnee.poursuite_master.alerte_ia}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFicheSelectionnee(null)}
              className="mt-6 w-full py-3 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition text-sm"
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      )}

      {/* Tiroir / Panier de Vœux */}
      {panierOuvert && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-black text-slate-900">
                Mes Vœux ({panierVoeux.length}/10)
              </h3>
              <button
                onClick={() => setPanierOuvert(false)}
                className="h-8 w-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {panierVoeux.length === 0 ? (
                <p className="text-sm text-slate-500 text-center mt-10">
                  Votre panier est vide. Cliquez sur "+ Vœu" pour ajouter des
                  formations.
                </p>
              ) : (
                (formationsData as Formation[])
                  .filter((f) => panierVoeux.includes(f.id))
                  .map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm relative"
                    >
                      <button
                        onClick={() => toggleVoeu(f.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 text-xs font-bold"
                      >
                        Retirer
                      </button>
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                        {f.domaine}
                      </div>
                      <div className="font-bold text-sm text-slate-900 pr-10 mb-2">
                        {f.nom}
                      </div>
                      <div className="text-xs text-slate-600 flex justify-between border-t border-slate-100 pt-2">
                        <span>
                          Sélection Master :{" "}
                          <strong>
                            {f.selection_master?.difficulte || "N/A"}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {panierVoeux.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-4 px-1">
                  <span>Coût moyen estimé :</span>
                  <span className="text-slate-900">
                    {Math.round(
                      (formationsData as Formation[])
                        .filter((f) => panierVoeux.includes(f.id))
                        .reduce(
                          (acc, curr) =>
                            acc +
                            (curr.frais_scolarite_annuels +
                              coutLogementAnnuel) *
                              (curr.duree_formation_ans || 5),
                          0,
                        ) / panierVoeux.length,
                    ).toLocaleString()}{" "}
                    €
                  </span>
                </div>
                <button
                  onClick={() => setPanierVoeux([])}
                  className="w-full py-3 rounded-xl border-2 border-rose-100 text-rose-600 font-semibold text-sm hover:bg-rose-50 transition"
                >
                  Vider la sélection
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer & Mentions Légales */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            ParcoursClair — Observatoire indépendant
          </p>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">
            Ce site n'est pas affilié au gouvernement ni au Ministère de
            l'Enseignement supérieur. Les données brutes proviennent de l'Open
            Data (SIES / InserSup). Certaines valeurs (sélection MonMaster,
            salaires réindexés sur l'inflation) sont des estimations à but
            purement informatif. Vérifiez toujours les informations sur les
            plateformes officielles.
          </p>
          <div className="flex justify-center gap-4 text-xs font-medium text-slate-400">
            <a href="#" className="hover:text-slate-600 transition">
              Mentions Légales
            </a>
            <span>•</span>
            <a
              href="https://data.enseignementsup-recherche.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition"
            >
              Sources des données
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 transition">
              Méthodologie
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
