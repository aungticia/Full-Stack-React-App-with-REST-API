const ErrorsDisplay = ({ errors }) => {
    let errorsDisplay = null;
    
    // checks if there are errors to display 
    if (errors.length) {
        errorsDisplay = (
            <div>
                <div className="validation--errors">
                    <h3>Validation Errors</h3>
                    <ul>
                        {errors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
    return errorsDisplay;
}

export default ErrorsDisplay;