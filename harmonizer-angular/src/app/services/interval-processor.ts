class IntervalProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        input.foreach(inp => console.log(`input: ${inp}`));
        output.foreach(out => console.log(`output: ${out}`));
    }
}

registerProcessor('interval-processor', IntervalProcessor);