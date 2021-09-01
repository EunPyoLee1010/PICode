import React, { useEffect, useRef, useState } from "react";
import { cloneDeep } from "lodash";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import Modal, { IUser } from "./modal";
import { IDockerInfo, IProjectInfo, TSource } from "./create";
import { Close } from "@material-ui/icons";

export const DefualtInput = ({
  classes,
  setDefualtInput,
  defaultInput,
  type,
  step,
  setSource,
  source,
  dockerInfo,
  setDockerInfo,
}: {
  classes: any;
  setDefualtInput: React.Dispatch<React.SetStateAction<IProjectInfo>>;
  defaultInput: IProjectInfo;
  type: string;
  step: number;
  setSource: React.Dispatch<React.SetStateAction<TSource | undefined>>;
  source: TSource | undefined;
  dockerInfo: IDockerInfo;
  setDockerInfo: React.Dispatch<React.SetStateAction<IDockerInfo>>;
}) => {
  const [upload, setUpload] = React.useState<boolean>(false);
  const [imageName, setImageName] = React.useState<string>("");
  const [fileeName, setFileName] = React.useState<string>("");
  const [participantList, setParticipantList] = useState<IUser[]>([]);
  const [imageCheck, setImageCheck] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const fileButton = useRef<any>(null);

  const dragOver = (e: any) => {
    e.preventDefault();
  };

  const dragEnter = (e: any) => {
    e.preventDefault();
    setUpload(true);
  };

  const dragLeave = (e: any) => {
    e.preventDefault();
    setUpload(false);
  };

  const ThumbnailDrop = async (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files !== undefined) {
      setImageName(files[0].name);
      let formData = new FormData();
      formData.append("uploadFile", files[0]);
      let result = await fetch(`http://localhost:8000/api/data`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      if (result.code === 200) {
        setDefualtInput({
          ...defaultInput,
          projectThumbnail: result.uploadFileId,
        });
      }
    }
  };

  const fileDrop = async (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files !== undefined) {
      setFileName(files[0].name);
      let formData = new FormData();
      formData.append("uploadFile", files[0]);
      let result = await fetch(`http://localhost:8000/api/data`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
      if (result.code === 200) {
        let tmpSource = source;
        (tmpSource as any).upload.uploadFileId = result.uploadFileId;
        setSource(tmpSource);
      }
    }
  };

  const checkDockerImageValidity = async () => {
    const response = await fetch(`https://hub.docker.com/_/ubuntu`, {
      method: "GET",
      mode: "cors",
    }).then((res) => res.json());
  };

  const getParticipantList = async () => {
    await fetch(`http://localhost:8000/api/userList`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          setParticipantList(res.user);
        }
      });
  };

  useEffect(() => {
    getParticipantList();
  }, []);

  return (
    <React.Fragment>
      {step === 2 && (
        <React.Fragment>
          <div className={classes.subTitle}>Create Code</div>
          <div className={classes.input}>
            <span>
              Workspace Name <span className={classes.required}>*</span>
            </span>
            <input
              placeholder="Input Project Name"
              onChange={(e) => {
                setDefualtInput({
                  ...defaultInput,
                  projectName: e.target.value,
                });
              }}
              value={defaultInput.projectName}
            />
          </div>

          <div className={classes.divider}>
            <div />
          </div>
          <div className={classes.textarea}>
            <span>Project Description</span>
            <textarea
              rows={10}
              placeholder="Input Project Description"
              onChange={(e) => {
                setDefualtInput({
                  ...defaultInput,
                  projectDescription: e.target.value,
                });
              }}
              value={defaultInput.projectDescription}
            />
          </div>
          <div className={classes.divider}>
            <div />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              gap: "25px",
            }}
          >
            <div className={classes.textarea}>
              <span>Project Thumbnail</span>
              <div
                className={classes.imageUpload}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={ThumbnailDrop}
                onClick={() => fileButton.current.click()}
              >
                {upload ? (
                  <div style={{ textAlign: "center", pointerEvents: "none" }}>
                    <InsertPhotoIcon
                      style={{ width: "40px", height: "40px" }}
                    />
                    <br />
                    <span>{imageName !== "" ? imageName : "Drop Image"}</span>
                  </div>
                ) : (
                  <>
                    <div style={{ textAlign: "center" }}>
                      <CloudUploadIcon
                        style={{ width: "40px", height: "40px" }}
                      />
                      <br />
                      <span>
                        {type === "edit" ? (
                          "If you want change image, upload image"
                        ) : (
                          <React.Fragment>
                            <div>Drag and Drop Image or</div>
                            <div>Click to upload Image</div>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {type === "upload" && (
              <React.Fragment>
                <div className={classes.textarea}>
                  <span>
                    Project Zip File
                    <span className={classes.required}>*</span>
                  </span>
                  <div
                    style={{
                      display: "inline-block",
                      color: "#ffffff",
                      fontSize: "12px",
                      float: "right",
                    }}
                  >
                    is Extract?
                    <input
                      type="checkbox"
                      checked={
                        (source as any).upload
                          ? (source as any).upload.isExtract
                          : true
                      }
                      onClick={(e) => {
                        let tmpSource = cloneDeep(source);
                        (tmpSource as any).upload.isExtract =
                          e.currentTarget.checked;
                        setSource(tmpSource);
                      }}
                      style={{ verticalAlign: "middle" }}
                    />
                  </div>
                  <div
                    className={classes.imageUpload}
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={() => fileButton.current.click()}
                  >
                    {upload ? (
                      <div
                        style={{ textAlign: "center", pointerEvents: "none" }}
                      >
                        <InsertPhotoIcon
                          style={{ width: "40px", height: "40px" }}
                        />
                        <br />
                        <span>
                          {fileeName !== "" ? fileeName : "Drop File"}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div style={{ textAlign: "center" }}>
                          <CloudUploadIcon
                            style={{ width: "40px", height: "40px" }}
                          />
                          <br />
                          <span>
                            <div>Drag and Drop File or</div>
                            <div>Click to upload File</div>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <input
                  ref={fileButton}
                  style={{ display: "none" }}
                  type="file"
                  id="getFile"
                  onChange={async (e) => {
                    let tmpImage = e.target.files;
                    if (tmpImage !== null) {
                      let formData = new FormData();
                      formData.append("uploadFile", tmpImage[0]);
                      let result = await fetch(
                        `http://localhost:8000/api/data`,
                        {
                          method: "POST",
                          body: formData,
                        }
                      ).then((res) => res.json());
                      if (result.code === 200) {
                        let tmpSource = source;
                        (tmpSource as any).upload.uploadFileId =
                          result.uploadFileId;
                        setSource(tmpSource);
                      }
                    }
                  }}
                />
              </React.Fragment>
            )}
          </div>

          <div className={classes.participant}>
            <span>Project Participant</span>
            <div
              onClick={() => {
                setModal(true);
              }}
            >
              {(defaultInput.projectParticipants ?? []).length > 0 ? (
                <React.Fragment>
                  {(defaultInput.projectParticipants ?? []).map((v, i) => (
                    <div key={`project-participant-${i}`}>
                      {participantList.map((item) => {
                        if (item.userId === v) return item.userName;
                      })}
                      <div
                        onClick={(event: any) => {
                          // setDefualtInput({
                          //   ...defaultInput,
                          //   projectParticipants: (
                          //     defaultInput.projectParticipants ?? []
                          //   ).filter((item) => item !== v),
                          // });
                        }}
                      >
                        {/* <Close /> */}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ) : (
                `Input project Participant`
              )}
            </div>
          </div>
          {type === "git" && (
            <React.Fragment>
              <div className={classes.divider}>
                <div />
              </div>
              <div className={classes.subTitle}>Clone From Repository</div>
              <div className={classes.input}>
                <span>
                  Repository URL<span className={classes.required}>*</span>
                </span>
                <input
                  placeholder="Input Repository URL"
                  onChange={(e) => {
                    setSource(
                      source !== undefined
                        ? { ...source, gitUrl: e.target.value }
                        : {
                            type: type,
                            gitUrl: e.target.value,
                          }
                    );
                  }}
                  value={source === undefined ? "" : source.gitUrl}
                />
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {step === 3 && (
        <React.Fragment>
          <div className={classes.subTitle}>Create Container</div>
          <div
            className={classes.input}
            style={{ marginTop: "0px", fontSize: "14px" }}
          >
            <span>Basic Info</span>
          </div>
          <div className={classes.input}>
            <span>Container Name</span>
            <input
              placeholder="Input Container Name"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  containerName: e.target.value,
                });
              }}
              value={dockerInfo.containerName}
            />
          </div>
          <div className={classes.input}>
            <span>
              Image<span className={classes.required}>*</span>
            </span>
            <input
              placeholder="Input Image"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  image: e.target.value,
                });
              }}
              value={dockerInfo.image}
            />
          </div>
          <div className={classes.input}>
            <span>Tag</span>
            <input
              placeholder="Input Tag"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  tag: e.target.value,
                });
              }}
              value={dockerInfo.tag}
            />
          </div>
          <div className={classes.divider}>
            <div></div>
          </div>
          <div
            className={classes.input}
            style={{ marginTop: "0px", fontSize: "14px" }}
          >
            <span>Network Info</span>
          </div>
          <div className={classes.input}>
            <span>Network Name</span>
            <input
              placeholder="Input Bridge Name"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  bridgeName: e.target.value,
                });
              }}
              value={dockerInfo.bridgeName}
            />
          </div>
          <div className={classes.input}>
            <span>Network Alias</span>
            <input
              placeholder="Input Bridge Alias"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  bridgeAlias: e.target.value,
                });
              }}
              value={dockerInfo.bridgeAlias}
            />
          </div>
          <div className={classes.input}>
            <span>Port</span>
            <input
              placeholder="Input Host Port"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  hostPort: Number(e.target.value),
                });
              }}
              value={dockerInfo.hostPort}
            />
            <span
              style={{
                width: "15px",
                textAlign: "center",
                padding: "0px 6px",
                margin: "0px",
                fontWeight: "bold",
              }}
            >
              :
            </span>
            <input
              placeholder="Input Container Port"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  containerPort: Number(e.target.value),
                });
              }}
              value={dockerInfo.containerPort}
            />
          </div>
          <div className={classes.input}>
            <span>Containers To Be Connected</span>
            <input
              placeholder="Input Link Container"
              onChange={(e) => {
                setDockerInfo({
                  ...dockerInfo,
                  linkContainer: e.target.value,
                });
              }}
              value={dockerInfo.linkContainer}
            />
          </div>
          <input
            type="file"
            id="getFile"
            style={{ display: "none" }}
            ref={fileButton}
            onChange={async (e) => {
              let tmpImage = e.target.files;
              if (tmpImage !== null) {
                let formData = new FormData();
                formData.append("uploadFile", tmpImage[0]);
                let result = await fetch(`http://localhost:8000/api/data`, {
                  method: "POST",
                  body: formData,
                }).then((res) => res.json());
                if (result.code === 200) {
                  setUpload(true);
                  setImageName(tmpImage[0].name);
                  setDefualtInput({
                    ...defaultInput,
                    projectThumbnail: result.uploadFileId,
                  });
                }
              }
            }}
          />
        </React.Fragment>
      )}
      <Modal
        modal={modal}
        setModal={setModal}
        participantList={participantList}
        defaultInput={defaultInput}
        setDefualtInput={setDefualtInput}
        setParticipantList={setParticipantList}
      />
    </React.Fragment>
  );
};
