# DB mobels

## Account

-   **id** (_uuid_): id du compte
-   **username** (_str_): pseudonyme
-   **fullname** (_str_): nom d'affichage
-   **email** (_str_): adresse email
-   **password** (_str_): hash du mot de passe
-   **creation_date** (_date_): date de création du compte
-   **siren** (_str_): numero de siren (optionnel)
-   **last_token** (_str_): dernier token JWT envoyé (pour refresh le token)

## Property

-   **id** (_uuid_): id du logement
-   **landlord_id** (_uuid_): id du propriétaire
-   **address** (_str_): adresse du logement
-   **lot_number** (_int_): lot du nombre
-   **floor** (_int_): étage du logement (optionnel)
-   **image** (_str_): chemin (local) vers l'image de l'appartement
-   **type** (_str_): type de logement uniquement : entier / collocation
-   **surface** (_float_): surface en m² (optionnel)

## Room

-   **id** (_uuid_) : id de la chambre
-   **property_id** (_uuid_): id du logement
-   **image** (_str_): chemin (local) vers l'image de l'appartement
-   **rent** (_float_): montant du loyer (mensuel)
-   **charges** (_float_): montant des charges (mensuel)
-   **caution** (_float_): caution demandée pour la chambre
-   **surface** (_float_): surface en m² (optionnel)

## Tenant

-   **id** (_uuid_): id du locataire
-   **room_id** (_uuid_): id de la chambre occupée
-   **fullname** (_str_): nom d'affichage du locataire
-   **former_address** (_str_): ancienne adresse du locataire (optionnel)
-   **next_address** (_str_): nouvelle adresse du locataire (optionnel apres depart)
-   **comments** (_str_): commentaires sur le locataire
-   **entry_date** (_date_): date d'entrée du location
-   **leave_date** (_date_): date de départ du locataire
-   **guarantor** (_str_): le type de garant (parent, amis, visale, autre)
-   **email** (_str_): adresse email du locataire
-   **tel** (_str_): numero de téléphone

## Transaction

-   **id** (_uuid_): id de la transaction
-   **amount** (_float_): montant de la transaction (point de vue du propriétaire)
-   **tenant_id** (_uuid_): id du locataire
-   **landlord_id** (_uuid_): id du propriétaire
-   **description** (_str_): description de la transaction
-   **type** (_str_): type de transaction parmis : liquide, virement, chèque
-   **date** (_date_): date à laquelle le virement a été effectué
