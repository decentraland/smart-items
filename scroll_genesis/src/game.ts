import { Spawner } from "../node_modules/decentraland-builder-scripts/spawner";
import Scroll, { Props } from "./item";

const scroll = new Scroll();
const spawner = new Spawner<Props>(scroll);

spawner.spawn(
  "scroll",
  new Transform({
    position: new Vector3(4, 2, 8)
  }),
  {
    text: `Some
multiline
text
haha
what
a
beautiful
test`
  }
);

spawner.spawn(
  "scroll2",
  new Transform({
    position: new Vector3(3, 2, 6)
  }),
  {
    text: `simple text`
  }
);
