import { mount } from 'svelte';
import Options from './Options.svelte';
import './options.css';

const app = mount(Options, {
  target: document.getElementById('app')!,
});

export default app;
