SOURCES = packages

bootstrap: clean-all
	yarn --ignore-engines
	./node_modules/.bin/lerna bootstrap -- --ignore-engines

clean-all:
	rm -rf node_modules
	rm -rf package-lock.json

	$(foreach source, $(SOURCES), \
		$(call clean-source-all, $(source)))

define clean-source-all
	rm -rf $(1)/*/node_modules
	rm -rf $(1)/*/package-lock.json

endef
