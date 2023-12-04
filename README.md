# Rest API jako Node.js aplikace
### Kuta Samuel C4b

## [Link na server](http//:16.170.146.152/) bezici na AWS Cloud.

## Popis
Aplikace funguje jako REST API, tedy pri urcitych HTTP dotazech na spravne misto bud vraci data z databaze, nebo upravuje/pridava data do databaze.
- Data reprezentuji prispevky na fora

## Autentikace
Aplikace limituje kam ma uzivatel pristup pres autentifikaci, je potreba se prihlasit.

### !!**Pro prihlaseni pouzijte test test**!!


## API
Aplikace by mela spravne mit fukncni endpointy podle zadani na /api/\<endpoint>
Bud muzete poslat HTTP request, nebo vyuzit Frontendu ktery jsem udelal. Dostanete se k nemu po prihlaseni na adrese /api, nebo je odkaz v levem navbaru po normalnim prihlaseni.

### EDNPOINTS

POST /api/blog - vytvoření nového blog postu. Blog post byste museli posílat ve formátu JSON (konkretní specifikace je na vás, musí ale být netriviální, t.j. jeden blog post musí obsahovat alespoň samotný kontent, datum vytváření a jméno autora). Po vytvoření blog postu a jeho přidání do db byste měli vrátit identifikátor nově vytvořeného objektu;
**GET /api/blog** - zobrazení všech blog postů přítomných v db;
**GET /api/blog/blogId** - zobrazení blog postu odpovídajícího uvedenému identifikátoru. Pokud takovýto blog post neexistuje, vygenerujte správnou chybu;
**DELETE /api/blog/blogId** - smazaní blog postu odpovídajícího uvedenému identifikátoru. Pokud takovýto blog post neexistuje, vygenerujte správnou chybu;
**PATCH /api/blog/blogId** - častečný update blog postu odpovídajícího uvedenému identifikátoru. Pokud takovýto blog post neexistuje, vygenerujte správnou chybu.


## Problem
Vsechny endpointy nejsou funkcni, kvuli problemu ktery se mi zatim nepodarilo vyresit. **Prosil bych o moznost opraveni znamky pokud se mi aplikaci podari opravit.**
