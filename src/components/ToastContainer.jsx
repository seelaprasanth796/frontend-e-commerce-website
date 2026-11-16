import { useShop } from '../context/ShopContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useShop();
  if (!toasts.length) return null;

  const bgMap = {
    success: 'bg-success text-white',
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-dark text-white',
  };

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center border-0 shadow-lg mb-2 ${bgMap[t.type] || bgMap.success}`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body fw-medium d-flex align-items-center gap-2">
              <i className={`bi ${t.type === 'danger' ? 'bi-exclamation-circle' : 'bi-check-circle-fill'}`}></i>
              <span>{t.message}</span>
            </div>
            <button
              type="button"
              className={`btn-close ${t.type === 'warning' ? '' : 'btn-close-white'} me-2 m-auto`}
              onClick={() => dismissToast(t.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
}
