import { p as pipelineSymbol, A as AstroError, a as ActionCalledFromServerError } from './params-and-props_B3jbH-NX.mjs';
import { c as createActionsProxy } from './server_yjx_LAnn.mjs';

const actions = createActionsProxy({
  handleAction: async (param, path, context) => {
    const pipeline = context ? Reflect.get(context, pipelineSymbol) : void 0;
    if (!pipeline) {
      throw new AstroError(ActionCalledFromServerError);
    }
    const action = await pipeline.getAction(path);
    if (!action) throw new Error(`Action not found: ${path}`);
    return action.bind(context)(param);
  }
});

export { actions as a };
