export default function Footer() {
  return (
    <div className="text-center py-5 text-[0.68rem] text-text-muted leading-relaxed">
      <div>{'\u0905\u0928\u0941\u092a\u094d\u0930\u093f\u0924\u093e \u092c\u0940 \u0915\u094b. \u0939\u094c. \u0938\u094b. \u0932\u093f.'}</div>
      <div className="text-[0.62rem] text-text-muted opacity-60 mt-0.5">
{'\u0924\u0915\u094d\u0930\u093e\u0930 \u0935\u094d\u092f\u0935\u0938\u094d\u0925\u093e\u092a\u0928'} &middot; {new Date().getFullYear()}
      </div>
    </div>
  );
}
