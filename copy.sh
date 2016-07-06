DIR=${DS_DOCS:=../ds-docs}

rm -rf src/docs src/tutorials src/info
mkdir -p src/docs src/tutorials src/info

cp -r ${DIR}/docs/* src/docs
cp -r ${DIR}/tutorials/* src/tutorials
cp -r ${DIR}/info/* src/info
