const config = {
    data: {
        action: 'start',
        config: {
            maximumNumberOfIterations: 300,
            numberOfWolves: 10
        },
        func: '(x,y)=>x*x+y*y',
        searchArea: {
            min: {
                x: -100,
                y: -100
            },
            max: {
                x: 100,
                y: 100
            }
        }
    }
};

global.postMessage = (data) => {
    const results = data.result || [];
    const func = new Function('return' + config.data.func)();
    console.log({
        data,
        results,
        func
    });
    console.log(results.map(position => {
        return {
            ...position,
            value: func(position.x, position.y)
        }
    }))
}
let evaluationFunction;
global.addEventListener = (name, func) => {
    if (name !== 'message') {
        console.log(`Event ${name} is not subscribable`);
    }
    evaluationFunction = func;
}
require('./dist/index.js');
// send config to it
evaluationFunction(config);