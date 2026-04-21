## Strategy 
How to go about finding what is causing performance issues



1. Network request blocking


- This script is HubSpot’s native script loader and is responsible for loading essential platform functionality (forms, tracking, and integrations).

*/hs/scriptloader/*.js 

- Request blocking before running lighthouse any suspected script that may be causing issues ex.

www.googletagmanager.com
*forms/v2.js*




## When Testing

- Application > storage > clearsite
