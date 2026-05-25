import PageHeader from "../../components/PageHeader";

export default function FiturXyz() {
    return (
        <div id="dashboard-container">
            <div className="panel-card">
                <div className="panel-title">Fitur XYZ</div>
                <p className="mt-4">Ini adalah halaman Fitur XYZ</p>
                
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Deskripsi Fitur</h3>
                    <p className="text-gray-600 mb-4">
                        Fitur XYZ adalah fitur unggulan yang membantu Anda mengelola data dengan lebih efisien.
                        Dengan fitur ini, Anda dapat melakukan berbagai operasi dengan mudah dan cepat.
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-3">Keunggulan</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Mudah digunakan dan user-friendly</li>
                        <li>Performa cepat dan responsif</li>
                        <li>Terintegrasi dengan sistem lainnya</li>
                        <li>Dapat dikustomisasi sesuai kebutuhan</li>
                    </ul>
                    
                    <div className="mt-6">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Mulai Gunakan Fitur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
