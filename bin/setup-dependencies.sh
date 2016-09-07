### Setup
mkdir dependencies
cd dependencies

###############################
############# E2E #############
###############################
git clone https://github.com/deepstreamIO/deepstream.io-e2e.git
cd deepstream.io-e2e
if [ -z ${E2E_DOC_TAG} ]; then
  echo "Warning: No E2E_DOC_TAG branch/tag specified"
else
  git checkout ${E2E_DOC_TAG}
fi
cd ..

###############################
############ SPECS ############
###############################
git clone https://github.com/deepstreamIO/deepstream.io-client-specs.git
cd deepstream.io-client-specs
if [ -z ${SPECS_DOC_TAG} ]; then
  echo "Warning: No SPECS_DOC_TAG branch/tag specified"
else
  git checkout ${SPECS_DOC_TAG}
fi
cd ..

###############################
########### JAVA DOC ##########
###############################
git clone https://github.com/deepstreamIO/deepstream.io-client-java.git
cd deepstream.io-client-java
if [ -z ${JAVA_DOC_TAG} ]; then
  echo "Warning: No JAVA_DOC_TAG branch/tag specified"
else
  git checkout ${JAVA_DOC_TAG}
fi
./gradlew apidoc
cd ..

### Cleanup
cd ..