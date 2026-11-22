# CipherFlow — Centre des rapports d'avancement

> Point d'entrée de la documentation de suivi du projet. Les rapports sont destinés à être transmis périodiquement à l'enseignant.

## Rapports

| Rapport | Document | Sources et ressources | État |
|---|---|---|---|
| 01 | [Rapport PDF](./CipherFlow_EtatAvancement.pdf) | [Source LaTeX](./report.tex) · [Captures](./imgs/) | Réalisé |
| 02 | [Rapport PDF](./CipherFlow_EtatAvancement_V2.pdf) | [Source LaTeX](./main.tex) · [Captures](./imgs/) · [Logos et fond](./) | Réalisé |
| 03 | [Dossier Rapport_03](./Rapport_03/) | [Images](./Rapport_03/images/) | À préparer |
| 04 | [Dossier Rapport_04](./Rapport_04/) | [Images](./Rapport_04/images/) | À préparer |
| 05 | [Dossier Rapport_05](./Rapport_05/) | [Images](./Rapport_05/images/) | À préparer |

Les deux premiers rapports sont conservés à leurs emplacements historiques afin de préserver les chemins des ressources LaTeX. Les dossiers numérotés servent de structure de préparation et d'archivage pour les prochaines éditions.

## Organisation des prochains rapports

À partir du Rapport 03, chaque dossier suit la structure standard :

```text
Rapport_XX/
├── README.md
├── Rapport_XX.pdf
├── main.tex
└── images/
    ├── capture-01.png
    └── ...
```

- `Rapport_XX.pdf` : document final à remettre.
- `main.tex` : source LaTeX du rapport.
- `images/` : captures d'écran et illustrations utilisées dans ce rapport.
- `README.md` : notes de préparation et plan du rapport.

## Ressources historiques communes

| Ressource | Utilisation |
|---|---|
| [LOGO_FSTM.png](./LOGO_FSTM.png) | Identité visuelle de la Faculté |
| [LOGO_UCA.png](./LOGO_UCA.png) | Identité visuelle de l'Université |
| [background.jpg](./background.jpg) | Fond de page de garde du Rapport 02 |
| [imgs/](./imgs/) | Captures utilisées dans les sources historiques |

## Règles de gestion

1. Ne jamais écraser un rapport déjà transmis : créer une nouvelle version numérotée.
2. Conserver les sources LaTeX avec le PDF correspondant.
3. Stocker les images dans le dossier du rapport concerné.
4. Utiliser des noms explicites pour les captures (ex. `guide-page.png`, `pipeline-caesar.png`, `build-success.png`).
5. Ne déclarer comme réalisé que ce qui est vérifiable dans le code, les tests ou les captures.
6. Avant transmission, vérifier la compilation LaTeX et ouvrir le PDF généré.

## Calendrier de suivi

Les dates exactes de remise sont à confirmer avec l'enseignant. Les rapports 03 à 05 seront préparés progressivement jusqu'au 1er janvier 2027.
