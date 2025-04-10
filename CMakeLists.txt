cmake_minimum_required(VERSION 3.4.1)

project(monero-ts-wasm)

# build with exception whitelist from file
file(STRINGS wasm_exception_whitelist.txt WASM_EXCEPTION_WHITELIST)
string(REPLACE ";" "," WASM_EXCEPTION_WHITELIST "${WASM_EXCEPTION_WHITELIST}")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14 -Oz -s EXCEPTION_CATCHING_ALLOWED='[${WASM_EXCEPTION_WHITELIST}]' -D_REENTRANT")
add_definitions(-DAUTO_INITIALIZE_EASYLOGGINGPP -DNO_AES)

##############
# C++ bridge
##############

include_directories("src/cpp")

#####################
# monero-cpp
#####################

set(MONERO_CPP "external/monero-cpp")
set(MONERO_CPP_SRC "${MONERO_CPP}/src")

# headers
include_directories("${MONERO_CPP_SRC}")
include_directories("${MONERO_CPP}/external/libsodium/include")
include_directories("${MONERO_CPP}/external/libsodium/include/sodium")

##################
# monero-project
##################

set(MONERO_PROJECT "${MONERO_CPP}/external/monero-project")
set(MONERO_PROJECT_SRC "${MONERO_PROJECT}/src")

# headers
include_directories("src/main/cpp")
include_directories("${MONERO_PROJECT_SRC}/")
include_directories("${MONERO_PROJECT_SRC}/checkpoints")
include_directories("${MONERO_PROJECT_SRC}/common")
#include_directories("${MONERO_PROJECT_SRC}/crypto")
#include_directories("${MONERO_PROJECT_SRC}/crypto/crypto_ops_builder/include/")    # DISABLED?
#include_directories("${MONERO_PROJECT_SRC}/crypto/crypto_ops_builder/include/sodium")    # DISABLED?
include_directories("${MONERO_PROJECT_SRC}/cryptonote_basic")
#include_directories("${MONERO_PROJECT_SRC}/multisig")
#include_directories("${MONERO_PROJECT_SRC}/cryptonote_core")
#include_directories("${MONERO_PROJECT_SRC}/cryptonote_protocol")
#include_directories("${MONERO_PROJECT_SRC}/wallet")
#include_directories("${MONERO_PROJECT_SRC}/rpc")
#include_directories("${MONERO_PROJECT_SRC}/mnemonics")
include_directories("${MONERO_PROJECT}/external/")
include_directories("${MONERO_PROJECT}/external/easylogging++")
include_directories("${MONERO_PROJECT}/external/rapidjson/include")
include_directories("${MONERO_PROJECT}/external/unbound/libunbound")
include_directories("${MONERO_PROJECT}/external/db_drivers/liblmdb")
include_directories("${MONERO_PROJECT}/contrib/epee/include")
include_directories("${MONERO_PROJECT}/contrib/epee/include/net")

#include_directories("${CMAKE_CURRENT_BINARY_DIR}")
#include_directories("${MONERO_PROJECT_SRC}/wallet/api")

include_directories("${MONERO_PROJECT}/build/release/translations")
include_directories("${MONERO_PROJECT}/build/release/generated_include")

#############
# Unbound
#############

include_directories("~/unbound-1.22.0/libunbound")

#############
# OpenSSL
#############

#find_package(OpenSSL REQUIRED)
#message(STATUS "Using OpenSSL include dir at ${OPENSSL}")

set(OPENSSL ${CMAKE_SOURCE_DIR}/build/openssl)
include_directories("${OPENSSL}")
include_directories("${OPENSSL}/include") # must exist already - run bin/build-openssl-emscripten.sh

add_library(openssl_crypto STATIC IMPORTED)
set_target_properties(
    openssl_crypto PROPERTIES IMPORTED_LOCATION
    ${OPENSSL}/lib/libcrypto.a
)

add_library(openssl_ssl STATIC IMPORTED)
set_target_properties(
    openssl_ssl PROPERTIES IMPORTED_LOCATION
    ${OPENSSL}/lib/libssl.a
)

#############
# Boost
#############

set(BOOST ${CMAKE_SOURCE_DIR}/build/boost)
include_directories("${BOOST}")
include_directories("${BOOST}/include") # must exist already - run bin/build_boost_emscripten.sh

add_library(boost_chrono STATIC IMPORTED)
set_target_properties(
    boost_chrono PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_chrono.a
)

add_library(boost_system STATIC IMPORTED)
set_target_properties(
    boost_system PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_system.a
)

add_library(boost_thread STATIC IMPORTED)
set_target_properties(
    boost_thread PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_thread.a
)

add_library(boost_serialization STATIC IMPORTED)
set_target_properties(
    boost_serialization PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_serialization.a
)

add_library(boost_filesystem STATIC IMPORTED)
set_target_properties(
    boost_filesystem PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_filesystem.a
)

add_library(boost_regex STATIC IMPORTED)
set_target_properties(
    boost_regex PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_regex.a
)

#add_library(boost_atomic STATIC IMPORTED)
#set_target_properties(
    #boost_atomic PROPERTIES IMPORTED_LOCATION
    #${BOOST}/lib/libboost_atomic.a
#)

################################
# Keys-only wallet source files
################################

set(
    MONERO_WALLET_KEYS_SRC_FILES
    
    # monero-ts WASM bridge
    src/main/cpp/index.cpp
    src/main/cpp/monero_wasm_bridge.cpp
    
    # monero-cpp (modified for WASM)
    ${MONERO_CPP_SRC}/utils/monero_utils.cpp
    ${MONERO_CPP_SRC}/daemon/monero_daemon_model.cpp
    ${MONERO_CPP_SRC}/wallet/monero_wallet_model.cpp
    ${MONERO_CPP_SRC}/wallet/monero_wallet_keys.cpp
    ${MONERO_CPP}/external/libsodium/src/crypto_verify/verify.c
    
    # monero-project (modified for WASM)
    ${MONERO_PROJECT_SRC}/cryptonote_basic/cryptonote_basic_impl.cpp
    ${MONERO_PROJECT_SRC}/cryptonote_basic/account.cpp
    ${MONERO_PROJECT_SRC}/cryptonote_basic/cryptonote_format_utils.cpp
    ${MONERO_PROJECT_SRC}/cryptonote_basic/cryptonote_format_utils_basic.cpp
    ${MONERO_PROJECT_SRC}/crypto/crypto.cpp
    ${MONERO_PROJECT_SRC}/crypto/hash.c
    ${MONERO_PROJECT_SRC}/crypto/slow-hash.c
    ${MONERO_PROJECT_SRC}/crypto/oaes_lib.c
    ${MONERO_PROJECT_SRC}/crypto/crypto-ops.c
    ${MONERO_PROJECT_SRC}/crypto/crypto-ops-data.c
    ${MONERO_PROJECT_SRC}/crypto/keccak.c
    ${MONERO_PROJECT_SRC}/crypto/chacha.c
    ${MONERO_PROJECT_SRC}/crypto/random.c
    ${MONERO_PROJECT_SRC}/crypto/aesb.c
    ${MONERO_PROJECT_SRC}/crypto/tree-hash.c
    ${MONERO_PROJECT_SRC}/crypto/hash-extra-blake.c
    ${MONERO_PROJECT_SRC}/crypto/blake256.c
    ${MONERO_PROJECT_SRC}/crypto/hash-extra-groestl.c
    ${MONERO_PROJECT_SRC}/crypto/hash-extra-jh.c
    ${MONERO_PROJECT_SRC}/crypto/hash-extra-skein.c
    ${MONERO_PROJECT_SRC}/crypto/groestl.c
    ${MONERO_PROJECT_SRC}/crypto/jh.c
    ${MONERO_PROJECT_SRC}/crypto/skein.c
    ${MONERO_PROJECT_SRC}/cryptonote_core/cryptonote_tx_utils.cpp
    ${MONERO_PROJECT}/contrib/epee/src/byte_stream.cpp
    ${MONERO_PROJECT}/contrib/epee/src/byte_slice.cpp
    ${MONERO_PROJECT}/contrib/epee/src/hex.cpp
    ${MONERO_PROJECT}/contrib/epee/src/string_tools.cpp
    ${MONERO_PROJECT}/contrib/epee/src/memwipe.c
    ${MONERO_PROJECT}/contrib/epee/src/mlocker.cpp
    ${MONERO_PROJECT}/contrib/epee/src/mlog.cpp
    ${MONERO_PROJECT}/contrib/epee/src/wipeable_string.cpp
    ${MONERO_PROJECT}/contrib/epee/src/portable_storage.cpp
    ${MONERO_PROJECT}/contrib/epee/src/net_parse_helpers.cpp
    ${MONERO_PROJECT}/contrib/epee/src/parserse_base_utils.cpp
    ${MONERO_PROJECT_SRC}/common/base58.cpp
    ${MONERO_PROJECT_SRC}/device/device.cpp
    ${MONERO_PROJECT_SRC}/device/device_default.cpp
    ${MONERO_PROJECT_SRC}/hardforks/hardforks.cpp
    ${MONERO_PROJECT_SRC}/multisig/multisig.cpp
    ${MONERO_PROJECT_SRC}/multisig/multisig_account.cpp
    ${MONERO_PROJECT_SRC}/multisig/multisig_account_kex_impl.cpp
    ${MONERO_PROJECT_SRC}/multisig/multisig_clsag_context.cpp
    ${MONERO_PROJECT_SRC}/multisig/multisig_kex_msg.cpp
    ${MONERO_PROJECT_SRC}/multisig/multisig_tx_builder_ringct.cpp
    ${MONERO_PROJECT_SRC}/ringct/rctOps.cpp
    ${MONERO_PROJECT_SRC}/ringct/rctTypes.cpp
    ${MONERO_PROJECT_SRC}/ringct/rctCryptoOps.c
    ${MONERO_PROJECT_SRC}/ringct/rctSigs.cpp
    ${MONERO_PROJECT_SRC}/ringct/bulletproofs.cc
    ${MONERO_PROJECT_SRC}/ringct/bulletproofs_plus.cc
    ${MONERO_PROJECT_SRC}/ringct/multiexp.cc
    ${MONERO_PROJECT_SRC}/mnemonics/electrum-words.cpp
    ${MONERO_PROJECT}/external/easylogging++/easylogging++.cc
)

################################
# Full wallet source files
################################

set(
    MONERO_WALLET_FULL_SRC_FILES
    
    # monero-ts WASM bridge
    src/main/cpp/http_client_wasm.cpp
    
    # monero-cpp (modified for WASM)
    ${MONERO_CPP_SRC}/wallet/monero_wallet_full.cpp
    
    # monero-project (modified for WASM)
    ${MONERO_PROJECT}/external/db_drivers/liblmdb/mdb.c
    ${MONERO_PROJECT}/external/db_drivers/liblmdb/midl.c
    ${MONERO_PROJECT}/contrib/epee/src/abstract_http_client.cpp
    #${MONERO_PROJECT}/contrib/epee/src/http_auth.cpp
    ${MONERO_PROJECT_SRC}/wallet/wallet2.cpp
    ${MONERO_PROJECT_SRC}/wallet/message_store.cpp
    ${MONERO_PROJECT_SRC}/wallet/message_transporter.cpp
    ${MONERO_PROJECT_SRC}/wallet/node_rpc_proxy.cpp
    ${MONERO_PROJECT_SRC}/wallet/wallet_rpc_payments.cpp
    #${MONERO_PROJECT_SRC}/blockchain_db/lmdb/db_lmdb.cpp
    ${MONERO_PROJECT_SRC}/cryptonote_core/cryptonote_tx_utils.cpp
    ${MONERO_PROJECT_SRC}/checkpoints/checkpoints.cpp
    ${MONERO_PROJECT_SRC}/common/perf_timer.cpp
    ${MONERO_PROJECT_SRC}/common/threadpool.cpp
    ${MONERO_PROJECT_SRC}/common/aligned.c
    ${MONERO_PROJECT_SRC}/common/util.cpp
    ${MONERO_PROJECT_SRC}/common/i18n.cpp
    ${MONERO_PROJECT_SRC}/common/combinator.cpp
    ${MONERO_PROJECT_SRC}/rpc/rpc_payment_signature.cpp
    ${MONERO_PROJECT_SRC}/wallet/ringdb.cpp
    ${MONERO_PROJECT_SRC}/cryptonote_basic/miner.cpp
    ${MONERO_PROJECT_SRC}/cryptonote_basic/difficulty.cpp
    ${MONERO_PROJECT_SRC}/cryptonote_core/tx_sanity_check.cpp
)

####################
# Build parameters
####################

#-s USE_PTHREADS=1 \
#-s PTHREAD_POOL_SIZE=2 \
#-s PROXY_TO_PTHREAD \
#-s DISABLE_EXCEPTION_CATCHING=0 \
#-s ASYNCIFY=1 \
#-s 'ASYNCIFY_IMPORTS=[\"js_send_json_request\",\"js_send_binary_request\",\"emscripten_sleep\"]' \
#-s ALLOW_MEMORY_GROWTH=0 \
#-s INITIAL_MEMORY=1536MB \
#-s MALLOC=emmalloc \
#-s INITIAL_MEMORY=1024MB \
#-s TOTAL_STACK=512MB \

set (
EMCC_LINKER_FLAGS_BASE

# unsure if the -I...boost..include is necessary here due to include above
# TODO? does EXPORT_NAME need to be the same for both targets? (or should it be set per-target with …_WASM, …_ASMJS?)

"-Wall -Werror -Wno-js-compiler -Wl,--allow-undefined -std=c++14 -Oz -D_REENTRANT \
--bind \
-s MODULARIZE=1 \
-s 'EXPORT_NAME=\"monero_ts\"' \
-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
-s ASSERTIONS=0 \
-s EXIT_RUNTIME=0 \
-s PRECISE_F32=1 \
-s EXCEPTION_DEBUG=0 \
-s NO_DYNAMIC_EXECUTION=1 \
-s NODEJS_CATCH_EXIT=0 \
-s RESERVED_FUNCTION_POINTERS=5 \
-s EXPORTED_RUNTIME_METHODS='[\"UTF8ToString\",\"stringToUTF8\",\"lengthBytesUTF8\",\"intArrayToString\",\"getTempRet0\",\"addFunction\"]' \
-s SINGLE_FILE=1 \
-s ALLOW_MEMORY_GROWTH=1 \
-s WASM_BIGINT=1 \
-s EXPORTED_FUNCTIONS='[_free, _malloc]' \
-s STACK_SIZE=5MB \
-s DEFAULT_PTHREAD_STACK_SIZE=2MB \
"
    # • Disabling exception catching does not introduce silent failures 
    # • Probably don't need PRECISE_F32 but wouldn't want to not use it
    #
    #
    # -s SAFE_HEAP=1 \
    # -g \
)

set(
EMCC_LINKER_FLAGS_FULL
"${EMCC_LINKER_FLAGS_BASE} \
-s ASYNCIFY=1 \
-s 'ASYNCIFY_IMPORTS=[\"js_send_json_request\",\"js_send_binary_request\",\"emscripten_sleep\"]' \
"
)

message(STATUS "EMCC_LINKER_FLAGS_FULL ${EMCC_LINKER_FLAGS_FULL}")

####################
# Build targets
####################

add_executable(monero ${MONERO_WALLET_FULL_SRC_FILES} ${MONERO_WALLET_KEYS_SRC_FILES})
set_target_properties(monero PROPERTIES LINK_FLAGS "${EMCC_LINKER_FLAGS_FULL}")
target_compile_definitions(monero PRIVATE BUILD_WALLET_FULL=1)
target_link_libraries(
    monero
    #
    #openssl_ssl
    #openssl_crypto
    #
    boost_chrono
    boost_system
    boost_thread
    boost_serialization
    boost_filesystem
    boost_regex
    #boost_atomic
    #
    ${log-lib}
)

# build to bitcode instead of wasm
#SET(CMAKE_EXECUTABLE_SUFFIX ".bc")