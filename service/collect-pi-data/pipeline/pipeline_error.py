class PipelineError(Exception):
    def __init__(self, message, step, original_exception):
        super().__init__(f"{message}: step: {step} {str(original_exception)}")
        self.original_exception = original_exception
        self.step = step