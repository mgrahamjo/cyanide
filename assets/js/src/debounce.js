'use strict';

export function debounce(func, wait) {
 
    let timeout, args, timestamp;

    return function() {

        args = [].slice.call(arguments, 0);

        timestamp = new Date();

        let later = function() {

            let last = (new Date()) - timestamp;

            if (last < wait) {
                timeout = setTimeout(later, wait - last);

            } else {

                timeout = null;
                
                func.apply(undefined, args);
            }
        };

        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
    };
};