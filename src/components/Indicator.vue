<template>
  <div id="indicator"></div>
</template>

<script>
    export default {
        name: "Indicator"
    }
</script>

<style>
  #indicator {
    display: none;
    width: 100vw;
    height: 100vh;
    position: absolute;
    opacity: 0.8;
    z-index: 1000000000;
    background: grey;
  }

  @keyframes spinner-line-fade-more {
    0%, 100% {
      opacity: 0; /* minimum opacity */
    }
    1% {
      opacity: 1;
    }
  }

  @keyframes spinner-line-fade-quick {
    0%, 39%, 100% {
      opacity: 0.25; /* minimum opacity */
    }
    40% {
      opacity: 1;
    }
  }

  @keyframes spinner-line-fade-default {
    0%, 100% {
      opacity: 0.22; /* minimum opacity */
    }
    1% {
      opacity: 1;
    }
  }
</style>
