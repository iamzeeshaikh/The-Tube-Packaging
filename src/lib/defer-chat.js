/**
 * Defer the Zendesk chat widget to first interaction or idle.
 *
 * The captured markup bootstraps it from an inline script at the very top of
 * <head>, so on every page Zendesk's bundle competes with the stylesheet and
 * the LCP image for bandwidth before anything has painted. It is a support
 * widget: nobody needs it in the first second, and most visitors never open it.
 *
 * The replacement keeps the same snippet and the same account key, and runs it
 * on the first scroll, pointerdown, keydown or touch — or five seconds after
 * the load event, whichever comes first. The widget still appears on
 * its own for anyone who waits, and appears immediately for anyone who reaches
 * for it.
 *
 * The site's own WhatsApp button is left alone: it is first-party, it is the
 * visible contact affordance on mobile, and deferring it would be visible.
 */
const ZENDESK = /<!--Start of Zendesk Chat Script-->[\s\S]*?<!--End of Zendesk Chat Script-->/;

const DEFERRED = `<!-- Zendesk Chat, deferred to first interaction or idle -->
<script type="text/javascript">
(function () {
  var started = false;
  function boot() {
    if (started) return;
    started = true;
    window.$zopim||(function(d,s){var z=$zopim=function(c){
    z._.push(c)},$=z.s=
    d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
    _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
    $.src='https://v2.zopim.com/?4h3lbyJihoT1mCOqDA0VoQOaVQE9qTOP';z.t=+new Date;$.
    type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
  }
  var events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
  events.forEach(function (e) {
    window.addEventListener(e, boot, { once: true, passive: true });
  });
  // Not requestIdleCallback: on a fast connection the browser is idle within a
  // few hundred milliseconds of load, so it fired straight back into the
  // critical path and the deferral bought nothing. A plain delay measured from
  // the load event is what actually keeps it out of the way.
  var delay = function () { setTimeout(boot, 5000); };
  if (document.readyState === 'complete') delay();
  else window.addEventListener('load', delay, { once: true });
}());
</script>
<!-- End Zendesk Chat -->`;

export function deferChat(head) {
  if (!head) return head;
  return head.replace(ZENDESK, DEFERRED);
}
