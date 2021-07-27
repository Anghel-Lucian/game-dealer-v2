# game-dealer-v2

App built for searching video game deals. The deals are fetched from CheapShark API, along with some images of the game provided by RAWG API.

The app is based on the Model-View-Controller architectural pattern, because the state changes frequently in the app. For example, each displayed result is an anchor element with the href like so: "#<custom id>". As such, each time the user clicks one of the results, the hash changes, which causes the app to make new API fetch requests to CheapShark and RAWG with the purpose of displaying even more data about a certain game. Because of this fact, and many other state-related features, MVC works very well with this kind of application.

As seen in the structure of the code, there is a view JavaScript file for each major component of the application.

The user has the ability of bookmarking certain games so that they are available on future accesses of the app. Because of the fact that the app does not function with a database, or authentication, the bookmarks are SAVED INSIDE THE BROWSER'S LOCAL STORAGE, as such, make sure to clear it after using the app if you add bookmarks.
