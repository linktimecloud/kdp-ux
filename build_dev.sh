# Build Frontend App
cd ./frontend && yarn && yarn build

# Build Node App
cd ../web && yarn

# copy frontend build to web public path
rm -rf ./public

mkdir ./public

cp -R ../frontend/dist/* ./public

# run node app
bash setupBackend.sh
