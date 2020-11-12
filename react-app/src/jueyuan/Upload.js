import React from "react";
import moment from "moment";

import Title from "../components/Title";
import Detail from "./components/Detail";
import Sidebar from "./components/Sidebar";
import config from "../config";
import socket from "../Socket";
import commonUtil from "../commonUtil";

const insertOriginal = (body) =>
	new Promise((resolve, reject) => {
		fetch(`${window.SEVER_PATH}/api/jueyuan/original/`, {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then((res) => res.json())
			.then((response) => resolve(response))
			.catch((err) => reject(err));
	});

const insulationUpload = (body) =>
	new Promise((resolve, reject) => {
		fetch(`${window.SEVER_PATH}/api/jueyuan/mod5/`, {
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then((res) => res.json())
			.then((response) => resolve(response))
			.catch((err) => reject(err));
	});

const Upload = (props) => {
	const [list, setList] = React.useState([]);

	const [load, setLoad] = React.useState(false);

	const [loadText, setLoadText] = React.useState("");

	const [detailFlg, setDetailFlg] = React.useState(false);

	const [item, setItem] = React.useState(0);

	const [percentage, setPercentage] = React.useState(0);

	const [inx, setInx] = React.useState(-1);

	// const [id4, setId4] = React.useState([])

	const [original, setOriginal] = React.useState([]);

	const [dzEnd, setDzEnd] = React.useState(0);

	const [dzStart, setDzStart] = React.useState(0);

	const [dyEnd, setDyEnd] = React.useState(0);

	const [dyStart, setDyStart] = React.useState(0);

	const [allFlg, setAllFlg] = React.useState(false);

	socket
		.off("jueyuanReadData")
		.on("jueyuanReadData", (data) => {
			if (data === "err") {
				setLoad(false);
				alert("设备拒绝访问,请检查设备连接!");
			} else {
				const attribute = commonUtil.juyuandata(data).attribute;
				if (allFlg) {
          console.info(inx)
					if (
						attribute.deviceId === 99999999 &&
						attribute.personnel === "试验人员" &&
						attribute.team === "试验班组" &&
						attribute.date === "2000-01-01 01:00"
					) {
						if (inx < 256) {
							setInx(256);
							setPercentage((256 / 511) * 100);
						} else {
							setPercentage(100);
							setInx(-1);
							setLoad(false);
						}
					} else {
            setList((p) => {
              p.push(attribute);
              return p;
            });
            setOriginal((p) => {
              p.push({
                data:data,
                datime: moment().format('YYYY-MM-DD HH:mm:ss')
              });
              return p;
            });
            setPercentage((inx / 511) * 100);
            if (inx === 511) {
							setLoad(false);
						} else {
							setInx(inx + 1);
						}
          }
          
				} else {
          setList((p) => {
            p.push(attribute);
            return p;
          });
          setOriginal((p) => {
            p.push({
              data:data,
              datime: moment().format('YYYY-MM-DD HH:mm:ss')
            });
            return p;
          });
          setPercentage((inx / 511) * 100);
					if (inx < 256) {
						if (inx === dzEnd) {
              if (dyStart !== 0) {
                setInx(dyStart);
              } else {
                setInx(-1);
                setLoad(false);
                setPercentage(100);
              }
						} else {
							setInx(inx + 1);
						}
					} else {
						if (inx === dyEnd) {
							setInx(-1);
							setLoad(false);
							setPercentage(100);
						} else {
							setInx(inx + 1);
						}
					}
        }
        
			}
		})
		.off("clearDevice")
		.on("clearDevice", (data) => {
			if (data === "err") {
				setLoad(false);
				alert("清除数据失败");
			} else {
				setLoad(false);
				alert("待发数据已清除");
				socket.emit("jueyuanId4", {
					hex: config.order["insulation"].setup_time.replace(
						/{date}/,
						moment().format("YYMMDDHHmm")
					),
					comName: decodeURIComponent(props.match.params.comName),
					len: 64,
				});
			}
		})
		.off("jueyuanId4")
		.on("jueyuanId4", (data) => {
			if (data === "err") {
				setLoad(false);
				alert("设备拒绝访问,请检查设备连接!");
			} else {
				const hex = data.split(" ");
				let dz_size = parseInt(hex[23], 16);
        const dz_inx = parseInt(hex[24], 16);
        if (dz_size === 0 && dz_inx === 255) {
          dz_size = 256
        }
        if (dz_inx === 0) {
          setDzStart(0);
				  setDzEnd(0);
        } else { 
          if (dz_size === 256) {
            setDzStart(dz_size - dz_inx-1);
          } else {
            setDzStart(dz_size - dz_inx);
          }
				  setDzEnd(dz_size-1);
        }
        console.info(dz_size - dz_inx-1,dz_size-1)
        let dy_size = parseInt(hex[37], 16) + 256;
        const dy_inx = parseInt(hex[38], 16);
        if (dy_size === 256 && dy_inx === 255) {
          dy_size = 512
        }
        if (dy_inx === 0) {
          setDyStart(0);
				  setDyEnd(0);
        } else {
          console.info(dy_size-dy_inx-1,dy_size-1)
          if (dy_size === 512) {
            setDyStart(dy_size-dy_inx-1);
          } else {
            setDyStart(dy_size-dy_inx);
          }
          setDyEnd(dy_size-1);
        }
			}
		});

	React.useEffect(() => {
		socket.emit("jueyuanId4", {
			hex: config.order["insulation"].setup_time.replace(
				/{date}/,
				moment().format("YYMMDDHHmm")
			),
			comName: decodeURIComponent(props.match.params.comName),
			len: 64,
		});
	}, []);

	React.useEffect(() => {
		if (inx !== -1 && load) {
			const num_16 = inx.toString(16);
			let str = "";
			for (let i = 0; i < 4 - num_16.length; i++) str += "0";
			socket.emit("jueyuanReadData", {
				comName: decodeURIComponent(props.match.params.comName),
				hex: config.order["insulation"].get_data.replace(/{NUM}/, str + num_16),
			});
		}
	}, [inx, props.match.params.comName, load]);

	const toDetail = (item) => {
		setItem(item);
		setDetailFlg(true);
	};

	const readData = () => {
		setAllFlg(false);
		if (dzEnd !== 0) {
			setLoad(true);
			setOriginal([]);
			setList([]);
			setLoadText("正在读取设备(请勿操作页面)...");
			setInx(dzStart);
		} else if (dyEnd !== 0) {
			setLoad(true);
			setOriginal([]);
			setList([]);
			setLoadText("正在读取设备(请勿操作页面)...");
			setInx(dyStart);
		} else {
			window.alert("没有可上传数据");
		}
	};

	const readAllData = () => {
    if(confirm("请确认,该操作耗时较长,是否继续?")) {
      setLoad(true);
      setOriginal([]);
      setList([]);
      setLoadText("正在读取设备(请勿操作页面)...");
      setAllFlg(true);
      setInx(0);
    }
		
	};

	//const stop = () => {
	//  setLoad(false);
	//};

	const upload = () => {
		setLoad(true);
		setLoadText("正在上传数据请(请勿操作页面)...");
		insulationUpload(list)
			.then((res) => {
				insertOriginal(original).then((res) => {});
				clearDevice();
			})
			.catch((err) => {
				setLoad(false);
				alert("上传失败,请检测网络连接!");
				console.info(err);
			});
	};

	const clearDevice = () => {
		setLoad(true);
		setLoadText("正在清除待发数据(请勿操作页面)...");
		socket.emit("clearDevice", {
			hex: config.order["insulation"].clear_data,
			comName: decodeURIComponent(props.match.params.comName),
			len: 64,
		});
	};

	return (
		<div className='row'>
			<Sidebar
				category='upload'
				id={props.match.params.id}
				comName={props.match.params.comName}
			/>
			<div className='col-md-10 col-lg-9  offset-md-2'>
				<div className=' card-body mt-3'>
					<Title title='数据上传' load={load} loadText={loadText} />
					<br />
					<div className='row'>
						<div className='col'>
							{detailFlg ? (
								<Detail item={item} back={() => setDetailFlg(false)} />
							) : (
								<table className='table table-sm table-bordered table-hover font-small'>
									<thead className='thead-light'>
										<tr>
											<th colSpan='10'>
												<div className='row'>
													<div className='col'>
														{
															<div
																className='progress p-2'
																style={{ height: "100%" }}
															>
																<div
																	className='progress-bar '
																	role='progressbar'
																	aria-valuenow='60'
																	aria-valuemin='0'
																	aria-valuemax='100'
																	style={{ width: `${percentage}%` }}
																>
																	{parseInt(percentage)}%
																</div>
															</div>
														}
													</div>
													<div
														className='pull-right btn-group btn-group-sm'
														style={{ right: "12px" }}
													>
														<button
															disabled={load}
															className='btn btn-success'
															onClick={readAllData}
														>
															读取全部数据
														</button>
														<button
															disabled={load}
															className='btn btn-info'
															onClick={readData}
														>
															读取代发数据
														</button>
														<button
															disabled={load}
															className='btn btn-primary'
															onClick={upload}
														>
															数据上传
														</button>
													</div>
												</div>
											</th>
										</tr>
										<tr>
											<th>#</th>
											<th>设备编号</th>
											<th>车次</th>
											<th>车次编组</th>
											<th>测试类别</th>
											<th>测试类型</th>
											<th>测试人员</th>
											<th>测试班组</th>
											<th>测试时间</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
										{list &&
											list.map((item, inx) => (
												<tr key={inx}>
													<td>{inx + 1}</td>
													<td>{item.deviceId}</td>
													<td>{item.trainNumber}</td>
													<td>{item.trainGroup}</td>
													<td>{item.dataType}</td>
													<td>{item.testType}</td>
													<td>{item.personnel}</td>
													<td>{item.team}</td>
													<td>{item.date}</td>
													<td>
														<button
															className='btn btn-primary btn-sm font-small'
															onClick={() => toDetail(item)}
														>
															查看详情
														</button>
													</td>
												</tr>
											))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Upload;
