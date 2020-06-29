# Decentraland smart items

This repository contains all of the smart itmes that are available by default in the Decentraland [Builder](https://builder.decentraland.org).

## About smart items

Smart items are special assets that include custom functionality, like buttons that can be pressed or doors that can be opened. Learn more about them in the Builder documentation: [docs.decentraland.org/builder/smart-items/](https://docs.decentraland.org/builder/smart-items/)

## Creating smart items

To create your own smart item, it's best to copy one of the existing smart items in this repository and edit it. The main files in a smart item are:

- `asset.json`: The smart item manifest. Includes name, ID, category, tags. It also defines all the configurable **parameters** available in the UI, and all the **actions** that can be called by other smart items that share a scene.

- `item.ts`: Contains the main code that controls the behavior of the item. Must include a class definition for the item, that has an `init()` function (to be called once when the scene starts), and a `spawn()` function (to be called once for every instance of the item when initialized). The `spawn()` function must take an argument of type `Props` that contains all of the parameters configured in the smart item's UI.

- `game.ts`: Contains a scene that is used for testing the item's functionality locally. This scene can include multiple instances of the item, or other entities to carry out more elaborate tests.

Learn more about how to create custom smart itmes in the SKD documentation: [docs.decentraland.org/development-guide/smart-items/](https://docs.decentraland.org/development-guide/smart-items/).
