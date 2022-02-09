# Documentation de l'API

## Authentification

```http
POST /auth/login
```

Body:

-   username (str): nom de l'utilisateur
-   password (str): hash du mot de passe (bcrypt / argon2)

Returns:

-   status (bool): résultat de l'authentification
-   token (str): jeton JWT correspondant à l'utilisateur

```http
POST /auth/register
```

Body:

-   username (str): pseudonyme
-   fullname (str): nom d'affichage
-   email (str): adresse email
-   password (str): hash du mot de passe
-   creation_date (date): date de création du compte
-   last_token (str): dernier token JWT envoyé (pour refresh le token)

Returns:

-   status (bool): résultat de l'inscription
-   message (str): message d'erreur si impossible de créer l'utilisateur

```http
GET /auth/check_token?token=<token>
```

Args:

-   token (str): token JWT a vérifier

Returns:

-   status (bool): validité du token
-   new_token (str): nouveau token si l'ancien est expiré et que l'on peut le refresh

## Propriétaire

```http
GET /account/infos?token=<token>
```

Args:

-   token (str): token JWT de l'utilisateur à récupérer

Returns:

-   account (json): infos sur l'utilisateur à l'exception du hash du mot de passe

## Biens

```http
GET /property/?token=<token>
```

Args:

-   token (str): token JWT du propriétaire

Returns:

-   properties ([uuid]): liste des uuid des appartements

```http
GET /property/[id]?token=<token>
```

Args:

-   id (uuid): id du logement
-   token (str): token JWT du propriétaire

Returns:

-   property ([json]): informations sur le bien

```http
POST /property/
```

Body:

-   token (str): token JWT du propriétaire
-   property (json): infos sur le logement (A DÉTAILLER)

Returns:

-   status (bool): réussite de la création du logement
-   uuid (str): id du bien
-   message (str): message d'erreur si échec de création

```http
PUT /property/[id]
```

Args:

-   id (uuid): id du bien

Body:

-   token (str): token JWT du propriétaire
-   property (json): infos sur le logement à mettre à jour (A DÉTAILLER)

Returns:

-   status (bool): réussite de la mise à jour du logement
-   message (str): message d'erreur si échec de création

```http
DELETE /property/[id]
```

Args:

-   id (uuid): id du bien

Body:

-   token (str): token JWT du propriétaire

Returns:

-   status (bool): réussite de la suppression du bien

## Locataires

```http
GET /tenant/?token=<token>
```

Args:

-   token (str): token JWT du propriétaire

Returns:

-   tenants ([uuid]): liste des uuid des locataires du propriétaire

```http
GET /tenant/[id]?token=<token>
```

Args:

-   id (uuid): id du locataire
-   token (str): token JWT du propriétaire

Returns:

-   tenant ([json]): informations sur le locataire

```http
POST /tenant/
```

Body:

-   token (str): token JWT du propriétaire
-   tenant (json): infos sur le locataire (A DÉTAILLER)

Returns:

-   status (bool): réussite de la création du locataire
-   uuid (str): id du locataire
-   message (str): message d'erreur si échec de création

```http
PUT /tenant/[id]
```

Args:

-   id (uuid): id du locataire

Body:

-   token (str): token JWT du propriétaire
-   tenant (json): infos sur le locataire à mettre à jour (A DÉTAILLER)

Returns:

-   status (bool): réussite de la mise à jour du locataire
-   message (str): message d'erreur si échec de création

```http
DELETE /tenant/[id]
```

Args:

-   id (uuid): id du locataire

Body:

-   token (str): token JWT du propriétaire

Returns:

-   status (bool): réussite de la suppression du locataire
