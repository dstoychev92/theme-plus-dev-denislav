# The store's Tradecraft data

Tradecraft holds the store's photo library, lists, vibes, shots, shoots, models, and
catalog. `tradecraft api graphql` sends a GraphQL request to Tradecraft for the one
store that the sign-in reaches, and prints the JSON answer.

## The store rule

- The sign-in reaches one store. The person approved it in the browser at
  `tradecraft login`. A project can have its own sign-in. Otherwise it uses the
  computer's sign-in.
- Never change the store yourself. Do not run `tradecraft login`, and do not edit or
  copy files in `~/.config/tradecraft/`. If the work needs another store, stop and
  ask the person to run `tradecraft login`.
- Each request prints the store and its access level to stderr, for example
  `theme-demo-bike.myshopify.com · write`. Check it before you use the answer. Tell
  the person which store the data came from.
- The store sets the access level: `read`, `write`, or `publish`. A `read` store
  answers queries only. Do not try a mutation that the level does not allow.

## Start

```bash
tradecraft status
tradecraft api graphql -f query='{ shop { name domain cliAccess } }'
```

`status` shows the store as `Store: <domain> · <access>`. If it shows none, or a
request says you are not signed in, ask the person to run `tradecraft login`.
Exit code 1 with a sentence on stderr is a refusal from Tradecraft. Show the sentence
to the person as it is.

## Learn the schema

Introspection is on. It is the schema documentation. Look before you guess a field.

```bash
tradecraft api graphql -f query='{ __schema { queryType { fields { name description args { name type { name kind ofType { name } } } } } } }'
tradecraft api graphql -f query='{ __type(name: "Photo") { fields { name description type { name kind ofType { name } } } } }'
tradecraft api graphql -f query='{ __type(name: "SearchInput") { inputFields { name description type { name kind ofType { name } } } } }'
```

## Example queries

Search the library:

```bash
tradecraft api graphql -f query='{ photos(search: { q: "bike" }, limit: 5) { totalCount nodes { id filename width height altText url(width: 800) shopifyImageReference } } }'
```

Use variables for values. `-f` gives a string. `-F` converts `true`, `false`,
`null`, and integers:

```bash
tradecraft api graphql \
  -f query='query($q: String!, $limit: Int) { photos(search: { q: $q }, limit: $limit) { totalCount nodes { id filename } } }' \
  -f q=helmet -F limit=10
```

Read the lists and a few photos from each:

```bash
tradecraft api graphql -f query='{ lists { id name photos(limit: 3) { totalCount nodes { id filename } } } }'
```

Keep a long query in a file. `query=@file` reads it, and `--input` sends a whole JSON
body:

```bash
tradecraft api graphql -f query=@queries/hero-photos.graphql -f q=trail
tradecraft api graphql --input request.json
```

## Use the answer in the theme

- `url(width: …)` gives an image you can fetch and look at. In development the URL
  expires after a few minutes. Fetch it soon after the query.
- A theme setting takes a photo as `shopify://shop_images/<filename>`. Only a photo
  with a `shopifyImageReference` is in the store's Shopify Files. A person exports a
  photo to Shopify Files from the Tradecraft app. Do not put a photo without a
  reference into a template.
- A GraphQL error comes back as JSON with an `errors` array and exit code 1. Read the
  message, check the schema, and fix the query.
