import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter({
      // optional options
      out: 'build'
    })
  }
};