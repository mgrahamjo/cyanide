#!/bin/bash

if [ command -v node >/dev/null 2>&1 ]; then

	echo "Node.js must be installed."

	if [ -d "/Applications/Google Chrome.app" ]; then
		
		/usr/bin/open -a "/Applications/Google Chrome.app" 'https://nodejs.org'
		
	fi

else

	cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

	if [ ! -d "node_modules" ]; then

		npm install

	fi

	node index.js

fi