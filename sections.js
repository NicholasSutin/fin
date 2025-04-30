    // Function to check if elements exist and set initial heights
    function setInitialHeights() {
        // Select all elements with the specified class names
        const firstRowElements = document.querySelectorAll('.first-row');
        const secondRowElements = document.querySelectorAll('.second-row');
        const thirdRowElements = document.querySelectorAll('.third-row');
        
        // Check if all required elements exist
        if (firstRowElements.length > 0 && secondRowElements.length > 0 && thirdRowElements.length > 0) {
            // Set initial heights
            firstRowElements.forEach(element => {
                element.style.height = 'calc(20vh)';
                element.style.transition = 'height 2s ease';
            });
            
            secondRowElements.forEach(element => {
                element.style.height = 'calc(60vh)';
                element.style.transition = 'height 2s ease';
            });
            
            thirdRowElements.forEach(element => {
                element.style.height = 'calc(20vh)';
                element.style.transition = 'height 2s ease';
            });
            
            return true; // Initial heights set
        }
        
        return false; // Elements not found
    }
    
    // Function to animate to equal heights
    function animateToEqualHeights() {
        const firstRowElements = document.querySelectorAll('.first-row');
        const secondRowElements = document.querySelectorAll('.second-row');
        const thirdRowElements = document.querySelectorAll('.third-row');
        
        // Calculate the equal height for all rows
        const equalHeight = 'calc((100vh / 3) - 1px)';
        
        // Animate to equal heights
        firstRowElements.forEach(element => {
            element.style.height = equalHeight;
        });
        
        secondRowElements.forEach(element => {
            element.style.height = equalHeight;
        });
        
        thirdRowElements.forEach(element => {
            element.style.height = equalHeight;
        });
    }
    
    // Try to set initial heights immediately
    if (!setInitialHeights()) {
        // If elements don't exist yet, try again when DOM is ready
        document.addEventListener('DOMContentLoaded', setInitialHeights);
    }
    
    // Wait for the entire page to load before starting the animation
    window.addEventListener('load', animateToEqualHeights);
    function investingBtn(){
        console.log("investing button clicked");
        window.location.href = "investing.html";
    }
    function fafsaBtn(){
        console.log("fafsa button clicked");
        window.location.href = "fafsa.html";
    }
    function collegeBtn(){
        console.log("college button clicked");
        window.location.href = "college.html";
    }
    function investmentResearchBtn(){
        console.log("Investment Research button clicked");
        window.location.href = "investing-evaluation.html";
    }
    function bankingBtn(){
        console.log("banking button clicked");
        window.location.href = "banking.html";
    }
    function taxesBtn(){
        console.log("taxes button clicked");
        window.location.href = "taxes.html";
    }
    function psaBtn(){
        console.log("taxes button clicked");
        window.location.href = "psa.html";
    }
    function budgetBtn(){
        console.log("budget button clicked");
        window.location.href = "budget.html";
    }