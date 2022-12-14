import Transform from "./defs/Transform.ts";
import Indexed from "./defs/Indexed.ts";

import rainrate from "./transforms/rainrate.ts";

export const transforms: Indexed<Transform> = {
	rainrate,
};
