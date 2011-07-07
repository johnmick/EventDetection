SRC_DIR = js/src
BUILD_DIR = js/build

BASE_FILES = ${SRC_DIR}/intro.js\
	${SRC_DIR}/canvasartist.js\
	${SRC_DIR}/console.js\
	${SRC_DIR}/vehiclemanager.js\
	${SRC_DIR}/vehicle.js\
	${SRC_DIR}/uimanager.js\
	${SRC_DIR}/main.js\
	${SRC_DIR}/outro.js

eventdetection = ${BUILD_DIR}/eventdetection.js
MIN = ${BUILD_DIR}/eventdetection.min.js
COMPILER = ${BUILD_DIR}/compiler.jar

eventdetection : ${eventdetection}
min : ${MIN}
gcomp : ${COMPILER}

${eventdetection} : ${BASE_FILES}
	@@echo "Building Unminified Version"
	@@cat ${BASE_FILES} > ${BUILD_DIR}/eventdetection.js

${COMPILER} : 
	@@echo "Copying Compiler"
	@@cp /cygdrive/d/Google\ Closure\ Compiler/compiler.jar ${BUILD_DIR}/

${MIN} : ${BUILD_DIR}/eventdetection.js ${COMPILER}
	@@echo "Building Minified Version"
	@@java -jar ${BUILD_DIR}/compiler.jar --js ${eventdetection} --js_output_file ${MIN}

clean :
	@@echo "Removing Build Directory Contents:" ${BUILD_DIR}
	@@rm -f ${BUILD_DIR}/*.*
