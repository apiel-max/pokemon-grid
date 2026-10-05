# Pokédex Grid

A simple Pokédex that pulls data from the [PokéAPI](https://pokeapi.co) and shows Pokémon in a grid. No libraries, no frameworks — just HTML, CSS and JavaScript.

## What it does

- Loads 20 Pokémon at a time straight from the API
- Each card shows the image, name, number, types, height and weight
- Hit **"Say hi!"** on any card and it'll introduce itself — like *"I am bulbasaur and I have overgrow."*
- Search bar filters by name on the spot, no extra API calls
- Next / Previous buttons to browse through all Pokémon
- Cards are colored by type, with hover effects and a loading spinner

## Files

```
├── index.html   — page structure
├── style.css    — layout, colors, animations
└── script.js    — fetching, rendering, search, pagination
```

## Running it

Just clone the repo and open `index.html` in a browser. You'll need an internet connection since all the data comes live from the PokéAPI.

## Data

Everything comes from [PokéAPI](https://pokeapi.co/docs/v2) — images, names, types, abilities, the works.
