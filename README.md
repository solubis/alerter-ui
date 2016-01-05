[![Stories in Ready](https://badge.waffle.io/solubis/alerter-ui.png?label=ready&title=Ready)](https://waffle.io/solubis/alerter-ui)
Alerter UI Framework (Beta)
=====================

### Framework provides several things:

-   Material Design Look and Feel via LESS files based on Bootrap classes and Grid system

-   Angular UI Bootstrap components and directives

-   ngTable component

-   additional components:

    -   pretty scrollbars

    -   loading bar

    -   toaster

    -   alert dialog

    -   sidebar

    -   toolbar

    -   auto-size textarea

    -   top search

    -   many more ...

### Documentation

[Documentation of components] (https://code.solubisgroup.com/fds/Alerter UI/wikis/home)

### Framework has several **dependencies which are ALL packed** in **dist/vendor.min.js**:

-   angular
-   angular-animate
-   angular-ui-router
-   angular-ui-bootstrap
-   jquery (unfortunatelly needed for some plugins - planned to get rid of after
    refactoring to angular directives)
-   waves
-   more..
 

## Usage

    $ bower install git@code.solubisgroup.com:jbla/Alerter UI.git --save

Add to index.html:

    <link rel="stylesheet" href="bower_components/Alerter UI/dist/Alerter UI.min.css">

or use less version in your LESS files:

    @import "bower_components/Alerter UI/src/Alerter UI";

and include scripts:

    <script src="bower_components/Alerter UI/dist/js/vendor.min.js"></script>
    <script src="bower_components/Alerter UI/dist/js/Alerter UI.min.js"></script>

also copy **fonts** and **images** folders from **bower\_component/Alerter UI/dist**
to your web application root folder

*YOU MUST NOT INCLUDE ANGULAR, ANGULAR UI ROUTER, ANGULAR BOOTSTRAP, JQUERY, NGTABLE*

To run demo server:
-------------------

    $ grunt server

Bugs and Issues (JIRA)
----------------------

Have a bug or an issue ? [Open a new issue][1]

[1]: <https://jira.solubisgroup.com/browse/Alerter UI/>

Todos
-----

1.  Angular version of

    1.  Sidebar

    2.  Scrollbars

    3.  Waves

    4.  Dropdown and Select

    5.  Collapse

    6.  TopSearch

2.  Proper multiselect

3.  Optimize and test (a lot)

Copyright and License
---------------------

Copyright 2015 solubis
