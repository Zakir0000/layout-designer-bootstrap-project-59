install:
	npm install

lint:
	npx stylelint ./app/css/*.css
	npx stylelint ./app/scss/**/*.scss
	npx htmlhint ./app/*.html

deploy:
	npx surge ./app/
